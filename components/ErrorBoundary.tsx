"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Optional custom fallback. Defaults to a minimal centered message. */
  fallback?: ReactNode;
  /** If true, renders nothing on error instead of a fallback UI. */
  silent?: boolean;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("[ErrorBoundary]", error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.silent) return null;
    if (this.props.fallback) return this.props.fallback;

    return (
      <div
        className="rounded-xl p-6 text-center"
        style={{ background: "var(--surface-card)", border: "1px solid var(--border)" }}
      >
        <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
          Something went wrong loading this section.
        </p>
        <button
          className="mt-3 text-xs underline"
          style={{ color: "var(--accent)" }}
          onClick={() => this.setState({ hasError: false })}
        >
          Try again
        </button>
      </div>
    );
  }
}
