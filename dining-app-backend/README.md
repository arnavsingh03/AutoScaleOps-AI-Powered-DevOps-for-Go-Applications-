# Dining App Backend

## Configuration

The application requires a `config.yaml` file in the `configs` directory. A template file `config.yaml.template` is provided as a reference.

To set up your configuration:

1. Copy the template file:
   ```bash
   cp configs/config.yaml.template configs/config.yaml
   ```

2. Update the values in `config.yaml` with your specific configuration:
   - Database credentials
   - JWT secret
   - Other environment-specific settings

Note: The `config.yaml` file contains sensitive information and is git-ignored. Make sure to keep your actual configuration file secure and never commit it to version control.

A modern restaurant table booking application built with Go.

## Project Structure
```bash
dining-app/
├── cmd/           # Application entry points
├── internal/      # Private application and library code
├── pkg/           # Public library code
├── configs/       # Configuration files
└── tests/         # Test files
