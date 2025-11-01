import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    // Clear all stored data and reload
    if (window.confirm('Reset the application? This will clear all stored data.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#000000' }}>
          <div className="max-w-md w-full text-center">
            {/* Error Icon */}
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                border: '2px solid #EF4444',
              }}
            >
              <svg 
                className="w-10 h-10" 
                style={{ color: '#EF4444' }}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                />
              </svg>
            </div>

            {/* Error Title */}
            <h1 
              className="font-orbitron font-bold text-2xl mb-3"
              style={{ color: '#FFFFFF' }}
            >
              Something Went Wrong
            </h1>

            {/* Error Message */}
            <p 
              className="text-sm mb-6"
              style={{ color: '#9CA3AF' }}
            >
              The application encountered an unexpected error.
              You can try resetting the app or refreshing the page.
            </p>

            {/* Error Details (in development) */}
            {this.state.error && (
              <details className="mb-6 text-left">
                <summary 
                  className="cursor-pointer text-sm font-medium mb-2"
                  style={{ color: '#00ADB5' }}
                >
                  Show Error Details
                </summary>
                <div 
                  className="p-4 rounded-lg text-xs overflow-auto max-h-48"
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#EF4444',
                  }}
                >
                  <p className="font-semibold mb-2">Error:</p>
                  <pre className="whitespace-pre-wrap break-words mb-4">
                    {this.state.error.toString()}
                  </pre>
                  {this.state.errorInfo && (
                    <>
                      <p className="font-semibold mb-2">Stack Trace:</p>
                      <pre className="whitespace-pre-wrap break-words text-xs">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </>
                  )}
                </div>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 rounded-lg font-semibold transition-all hover:opacity-90"
                style={{
                  background: '#00ADB5',
                  color: '#000000',
                }}
              >
                Refresh Page
              </button>
              
              <button
                onClick={this.handleReset}
                className="w-full py-3 rounded-lg font-semibold transition-all hover:opacity-90"
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid #EF4444',
                  color: '#EF4444',
                }}
              >
                Reset Application
              </button>

              <button
                onClick={() => window.location.href = '/login'}
                className="w-full py-3 rounded-lg font-semibold transition-all hover:opacity-90"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                }}
              >
                Go to Login
              </button>
            </div>

            {/* Support Info */}
            <div className="mt-6">
              <p className="text-xs" style={{ color: '#6B7280' }}>
                Need help? Contact{' '}
                <a 
                  href="mailto:aadipandey223@gmail.com" 
                  style={{ color: '#00ADB5' }}
                  className="hover:underline"
                >
                  aadipandey223@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
