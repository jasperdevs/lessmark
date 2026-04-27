//! Reserved crate for Lessmark, a strict agent-readable document format.
//!
//! The reference implementation currently lives in the npm `lessmark` package.

/// Crate version.
pub const VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg(test)]
mod tests {
    use super::VERSION;

    #[test]
    fn exposes_version() {
        assert!(!VERSION.is_empty());
    }
}