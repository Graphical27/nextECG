// List all available serial ports
// Run this to find your Arduino's COM port: node list-ports.js

const { SerialPort } = require('serialport');

console.log('Scanning for available serial ports...\n');

SerialPort.list().then(ports => {
  if (ports.length === 0) {
    console.log('No serial ports found!');
    console.log('\nMake sure:');
    console.log('  1. Arduino is connected via USB');
    console.log('  2. Arduino drivers are installed');
    return;
  }

  console.log('Available serial ports:\n');
  
  ports.forEach((port, index) => {
    console.log(`${index + 1}. ${port.path}`);
    if (port.manufacturer) {
      console.log(`   Manufacturer: ${port.manufacturer}`);
    }
    if (port.serialNumber) {
      console.log(`   Serial Number: ${port.serialNumber}`);
    }
    if (port.pnpId) {
      console.log(`   PnP ID: ${port.pnpId}`);
    }
    console.log('');
  });

  console.log('Update the "portPath" variable in server.js with one of these paths.\n');
  
  // Suggest the most likely Arduino port
  const arduinoPort = ports.find(p => 
    p.manufacturer && 
    (p.manufacturer.toLowerCase().includes('arduino') || 
     p.manufacturer.toLowerCase().includes('ftdi') ||
     p.manufacturer.toLowerCase().includes('ch340'))
  );

  if (arduinoPort) {
    console.log(`Suggested Arduino port: ${arduinoPort.path}`);
    console.log(`(Detected: ${arduinoPort.manufacturer})\n`);
  }
}).catch(err => {
  console.error('Error listing ports:', err.message);
});
