## Security Policy

### Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.2.x   | :white_check_mark: |
| 0.1.x   | :white_check_mark: |
| < 0.1   | :x:                |

### Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly:

1. **Do NOT open a public issue**
2. **Email the maintainer** (or use GitHub Security Advisories)
3. **Provide details**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will respond within 48 hours and work with you to address the issue.

### Security Best Practices

When using this extension:

1. **Protect API Keys**:
   - Never commit API keys to version control
   - Use environment variables
   - Rotate keys regularly

2. **Review Dependencies**:
   - Keep Pi Coding Agent updated
   - Review `package.json` before installing

3. **Validate Inputs**:
   - The extension validates all user inputs
   - Reports errors gracefully

4. **Local Storage**:
   - Generated images are stored locally
   - Review `.artifacts/` directory periodically

5. **Network Security**:
   - All API calls use HTTPS
   - API keys are transmitted securely

### Known Security Considerations

1. **API Keys in Environment**:
   - Environment variables can be read by other processes
   - Consider using secure credential managers in production

2. **Generated Content**:
   - Images are stored in plaintext on disk
   - Ensure appropriate file permissions

3. **Extension Permissions**:
   - Extensions run with full system permissions
   - Only install from trusted sources

### Disclosure Policy

- We follow responsible disclosure principles
- Security issues are fixed before public disclosure
- Credit given to reporters (if desired)

### Contact

For security issues, contact:
- GitHub Security Advisories (preferred)
- Email: [your-email]

Thank you for helping keep this project secure!
