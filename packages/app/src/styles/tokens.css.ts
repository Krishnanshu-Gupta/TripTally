import { css } from "@calpoly/mustang";

const styles = css`
:root {
  --primary-color: #007bff;
  --background-color: white;
  --secondary-color: #f8f9fa;
  --experience-box-color: white;
  --text-color: #333;
  --accent-color: #ffc107;
  --font-primary: 'Roboto', serif;
  --font-secondary: 'Roboto', sans-serif;
  --border-radius: 8px;
  --box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  --font-family-primary: 'Roboto', sans-serif;
  --font-family-secondary: 'Poppins', serif;
  --base-font-size: 16px;
  --space-sm: 10px;
  --space-md: 20px;
  --space-lg: 40px;

  --input-background-light: #ffffff;
  --input-border-light: #ccc;
  --input-text-light: #333;

  --input-background-dark: #1e1e1e;
  --input-border-dark: #555;
  --input-text-dark: #f0f0f0;
}

body.dark-mode {
  --background-color: #333;
  --secondary-color: #1e1e1e;
  --experience-box-color: #242424;
  --text-color: #e0e0e0;
  --primary-color: #90caf9;
  --accent-color: #ffd54f;

  --input-background-light: #1e1e1e;
  --input-border-light: #555;
  --input-text-light: #f0f0f0;
}
`;

export default { styles };
