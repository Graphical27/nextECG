// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <https://www.gnu.org/licenses/>.
//
// Copyright (c) 2024 - 2025 Upside Down Labs - contact@upsidedownlabs.tech
// Author: Deepak Khatri
//
// At Upside Down Labs, we create open-source DIY neuroscience hardware and software.
// Our mission is to make neuroscience affordable and accessible for everyone.
// By supporting us with your purchase, you help spread innovation and open science.
// Thank you for being part of this journey with us!

#include <Arduino.h>

/*
 * Adapted for NextECG from the official Upside Down Labs Chords Arduino firmware.
 * Matches the latest binary packet protocol expected by Chords Serial Plotter.
 * Set the board macro below to match your hardware; only one should be active.
 */

// ----- Board selection -----
#define BOARD_NANO_CLONE
// #define BOARD_NANO_CLASSIC
// #define BOARD_UNO_R3
// #define BOARD_MEGA_2560_R3
// #define BOARD_MEGA_2560_CLONE

// Simulation helper: set to 1 to output a synthetic ECG waveform on channel 0.
#define ENABLE_SIMULATION 0

#if defined(BOARD_UNO_R3)
  #define BOARD_NAME "UNO-R3"
  #define NUM_CHANNELS 6
#elif defined(BOARD_NANO_CLASSIC)
  #define BOARD_NAME "NANO-CLASSIC"
  #define NUM_CHANNELS 8
#elif defined(BOARD_NANO_CLONE)
  #define BOARD_NAME "NANO-CLONE"
  #define NUM_CHANNELS 8
#elif defined(BOARD_MEGA_2560_R3)
  #define BOARD_NAME "MEGA-2560-R3"
  #define NUM_CHANNELS 16
#elif defined(BOARD_MEGA_2560_CLONE)
  #define BOARD_NAME "MEGA-2560-CLONE"
  #define NUM_CHANNELS 16
#else
  #error "Board type not selected, please uncomment your BOARD macro!"
#endif

// Packet/timing configuration
#define SAMP_RATE 250
#define BAUD_RATE 115200
#define HEADER_LEN 3
#define SYNC_BYTE_1 0xC7
#define SYNC_BYTE_2 0x7C
#define END_BYTE 0x01
#define PACKET_LEN (NUM_CHANNELS * 2 + HEADER_LEN + 1)

#ifndef cbi
  #define cbi(sfr, bit) (_SFR_BYTE(sfr) &= ~_BV(bit))
#endif
#ifndef sbi
  #define sbi(sfr, bit) (_SFR_BYTE(sfr) |= _BV(bit))
#endif

volatile bool timerRunning = false;
volatile bool bufferReady = false;
uint8_t packetBuffer[PACKET_LEN];

#if ENABLE_SIMULATION
uint16_t simulateECG();
#endif

bool timerStart() {
  timerRunning = true;
  digitalWrite(LED_BUILTIN, HIGH);
  return TIMSK1 |= (1 << OCIE1A);
}

bool timerStop() {
  timerRunning = false;
  bufferReady = false;
  digitalWrite(LED_BUILTIN, LOW);
  return TIMSK1 &= ~(1 << OCIE1A);
}

ISR(TIMER1_COMPA_vect) {
  if (!timerRunning || Serial.available()) {
    timerStop();
    return;
  }

  bufferReady = true;
}

void timerBegin(float samplingRate) {
  cli();

  // Configure ADC prescaler to 16 for faster conversions
  sbi(ADCSRA, ADPS2);
  cbi(ADCSRA, ADPS1);
  cbi(ADCSRA, ADPS0);

  // Configure Timer1 for CTC mode with prescaler 8
  unsigned long ocrValue = (16000000UL / (8UL * (unsigned long)samplingRate)) - 1UL;
  TCCR1A = 0;
  TCCR1B = 0;
  TCNT1 = 0;

  OCR1A = ocrValue;
  TCCR1B |= (1 << WGM12) | (1 << CS11);

  sei();
}

uint16_t readChannelValue(uint8_t channel) {
#if ENABLE_SIMULATION
  if (channel == 0) {
    return simulateECG();
  }
  return 0;
#else
  return analogRead(channel);
#endif
}

void setup() {
  Serial.begin(BAUD_RATE);
  while (!Serial) {
    ; // Wait for serial port connection
  }

  pinMode(LED_BUILTIN, OUTPUT);
  digitalWrite(LED_BUILTIN, LOW);

  packetBuffer[0] = SYNC_BYTE_1;
  packetBuffer[1] = SYNC_BYTE_2;
  packetBuffer[2] = 0;
  packetBuffer[PACKET_LEN - 1] = END_BYTE;

  timerBegin(SAMP_RATE);
}

void loop() {
  if (timerRunning && bufferReady) {
    for (uint8_t channel = 0; channel < NUM_CHANNELS; ++channel) {
      uint16_t value = readChannelValue(channel);
      packetBuffer[HEADER_LEN + channel * 2] = highByte(value);
      packetBuffer[HEADER_LEN + channel * 2 + 1] = lowByte(value);
    }

    packetBuffer[2]++;
    Serial.write(packetBuffer, PACKET_LEN);
    bufferReady = false;
  }

  if (Serial.available()) {
    String command = Serial.readStringUntil('\n');
    command.trim();
    command.toUpperCase();

    if (command == "WHORU") {
      Serial.println(BOARD_NAME);
    } else if (command == "START") {
      timerStart();
    } else if (command == "STOP") {
      timerStop();
    } else if (command == "STATUS") {
      Serial.println(timerRunning ? "RUNNING" : "STOPPED");
    } else if (command.length() > 0) {
      Serial.println("UNKNOWN COMMAND");
    }
  }
}

#if ENABLE_SIMULATION
uint16_t simulateECG() {
  static unsigned long lastBeat = 0;
  static int baseline = 512;
  static const int BEAT_INTERVAL = 833;
  static const int NOISE_AMPLITUDE = 5;

  unsigned long currentTime = millis();
  int cyclePosition = (currentTime - lastBeat) % BEAT_INTERVAL;
  int value = baseline;

  if (cyclePosition >= 100 && cyclePosition < 160) {
    float t = (cyclePosition - 100) / 60.0f;
    value = baseline + static_cast<int>(20.0f * sin(t * PI));
  } else if (cyclePosition >= 200 && cyclePosition < 220) {
    value = baseline - 30;
  } else if (cyclePosition >= 220 && cyclePosition < 260) {
    float t = (cyclePosition - 220) / 40.0f;
    value = baseline + static_cast<int>(200.0f * sin(t * PI));
  } else if (cyclePosition >= 260 && cyclePosition < 300) {
    value = baseline - 40;
  } else if (cyclePosition >= 400 && cyclePosition < 550) {
    float t = (cyclePosition - 400) / 150.0f;
    value = baseline + static_cast<int>(30.0f * sin(t * PI));
  }

  value += random(-NOISE_AMPLITUDE, NOISE_AMPLITUDE);
  value = constrain(value, 0, 1023);

  if (cyclePosition < 50) {
    lastBeat = currentTime;
  }

  return static_cast<uint16_t>(value);
}
#endif
