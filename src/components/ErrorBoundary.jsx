import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Dashboard render error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-slate-50 min-h-[60vh] flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-3">Something went wrong</h1>
            <p className="text-sm text-slate-600 mb-2 font-light">
              The dashboard crashed unexpectedly. This is usually a temporary issue.
            </p>
            <p className="text-xs text-rose-600 font-mono mb-6 bg-rose-50 p-3 rounded-lg">
              {this.state.error?.message || "Unknown error"}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-6 py-2.5 text-sm font-medium text-white bg-brand-primary rounded-xl hover:bg-blue-600 shadow-sm transition"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
