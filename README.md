# Password Generator

![image](https://github.com/user-attachments/assets/6a65c1a9-5413-4f95-b5bd-f8a163fdfaae)

A secure, lightweight, and customizable password generator built with vanilla HTML, CSS, and JavaScript. This client-side application generates random passwords with flexible options, runs entirely offline, and is optimized for mobile IDEs like Acode. It features an entropy-based strength meter, password history, and accessibility support, making it a robust tool for creating strong passwords.

## Motivation

I created this password generator as a personal project to deepen my understanding of web development and cryptography while addressing the growing need for secure password creation. As someone passionate about coding and online security, I wanted to build a tool that empowers users to generate strong, random passwords tailored to their needs, without relying on external services. Working in Acode on a mobile device challenged me to keep the codebase lean and offline-friendly, while incorporating modern features like entropy calculations and accessibility. This project reflects my commitment to building practical, user-focused tools that enhance digital safety.

## Features

- **Customizable Password Generation**:
  - Adjustable length (4–32 characters)
  - Include/exclude uppercase letters (A-Z), lowercase letters (a-z), numbers (0-9), and symbols
  - Custom symbol input for specific symbol sets (e.g., `!@#$`)
  - Option to exclude similar characters (e.g., `l`, `1`, `I`, `O`, `0`) for readability
- **Entropy-Based Strength Meter**:
  - Calculates password strength using Shannon entropy, displayed as Weak, Fair, Good, or Strong (1–4 bars)
  - Updates dynamically based on length and character pool
- **Password History**:
  - Stores up to 5 recent passwords in LocalStorage with timestamps
  - Allows copying or clearing history
- **Accessibility**:
  - ARIA attributes for screen reader support
  - Keyboard navigation and focus management
  - WCAG-compliant contrast and typography
- **Copy to Clipboard**:
  - Easily copy generated or historical passwords
- **Responsive Design**:
  - Optimized for mobile and desktop devices
- **Offline-Friendly**:
  - No external dependencies or CDNs

## Installation

1. **Clone or Download**:
   - Clone the repository:  
     ```bash
     git clone https://github.com/your-username/password_generator.git
     ```
   - Or download the ZIP file and extract it.

2. **Project Structure**:
   ```
   password-generator/
   ├── index.html
   ├── style.css
   ├── script.js
   ├── README.md
   └── LICENSE
   ```

3. **Open the Application**:
   - Open `index.html` in a web browser (e.g., Chrome, Firefox, or Acode’s browser).
   - No server or dependencies required.

## Usage

1. **Generate a Password**:
   - Open `index.html` in a browser.
   - Adjust the password length using the slider (4–32 characters).
   - Check desired character types (uppercase, lowercase, numbers, symbols).
   - Optionally:
     - Enter custom symbols (e.g., `!@#$`) if symbols are enabled.
     - Check "Exclude Similar Characters" to avoid ambiguous characters (`l`, `1`, `I`, `O`, `0`).
   - Click **Generate Password** to create a password.
   - The strength meter will display the password’s strength (Weak, Fair, Good, Strong).

2. **Copy Password**:
   - Click the copy button next to the generated password to copy it to the clipboard.
   - A notification confirms the action.

3. **View Password History**:
   - Click **Show Password History** to view up to 5 recent passwords with timestamps.
   - Copy individual passwords or click **Clear History** to reset.

4. **Tips for Strong Passwords**:
   - Use length ≥ 16, all character types, and uncheck "Exclude Similar Characters" for maximum entropy (e.g., ~100 bits, "Strong").
   - Example settings: Length 16, all checkboxes checked, no exclusions → Password like `K7@mP9#xL2nQ$jRw`.

## Development

### Technologies
- **HTML5**: Semantic structure with ARIA attributes
- **CSS3**: Responsive design with custom properties and no frameworks
- **JavaScript (Vanilla)**: Modular code using an IIFE, with JSDoc comments
- **Fonts**: Web-safe `Inter` (body) and `Roboto Mono` (password display), with sans-serif fallbacks

### Code Quality
- Organized as a single module (`PasswordGenerator`) for encapsulation
- JSDoc comments for maintainability
- No external dependencies, ensuring offline compatibility
- Tested in Acode and modern browsers (Chrome, Firefox)

### Building and Testing
- **Run**: Open `index.html` in a browser.
- **Test**: Use browser developer tools (F12) to check console logs for entropy and strength level debugging.
- **Debug**: Logs include `Entropy`, `Pool Size`, `Length`, and `Selected Level` for troubleshooting.

### Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/new-feature`).
3. Commit changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Open a pull request.

## License

[MIT License](LICENSE)  
Copyright © 2025 jstnpbl

## Acknowledgments

- Built for offline use in mobile IDEs like Acode
- Inspired by modern password security best practices
- Accessibility features guided by WCAG 2.1

## Contact

For issues or suggestions, open an issue on GitHub or contact [justinpabale896@gmail.com](mailto:justinpabale896@gmail.com).
