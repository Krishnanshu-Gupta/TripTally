import { css } from "@calpoly/mustang";

const styles = css`
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: var(--font-secondary);
    line-height: 1.5;
    background-color: var(--secondary-color);
    color: var(--text-color);
    padding: 10px;
  }

  article {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: var(--background-color);
    color: var(--text-color);
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  page {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background-color: var(--color-primary);
    color: white;
 }

    h1 {
        margin: 0;
    }

    nav {
        display: flex;
        align-items: center;
    }

    .dark-mode-toggle {
    font-size: 1rem;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
}

.dark-mode-toggle input {
    margin-right: 8px;
    cursor: pointer;
}

  /* Experience Section */
  .content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 20px;
  }

  .experience {
    background-color: white;
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    padding: 20px;
  }

  h2 {
    font-family: var(--font-primary);
    font-size: 1.75rem;
    color: var(--primary-color);
  }

  a {
    text-decoration: none;
    color: var(--primary-color);
  }

  a:hover {
    text-decoration: underline;
  }

  p {
    margin: 10px 0;
    font-size: 1rem;
  }

  /* Star rating and icons */
  .icon {
    height: 1em;
    width: 1em;
    vertical-align: middle;
    fill: currentColor;
  }

  .gold {
    fill: var(--accent-color);
  }

  .half-star {
    fill: var(--accent-color);
    clip-path: inset(0 50% 0 0);
  }

  /* Footer */
  footer {
    text-align: center;
    margin-top: 20px;
  }

  footer a {
    color: var(--primary-color);
    font-weight: bold;
  }
`;

export default { styles };
