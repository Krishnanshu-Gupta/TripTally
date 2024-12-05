import {
	css,
	define,
	html,
	shadow,
	Dropdown,
	Events,
	Observer
} from "@calpoly/mustang";
import reset from "./styles/reset.css.js";
import headings from "./styles/headings.css.js";
import { initializeDarkMode, toggleDarkMode } from "./dark-mode.js";

export class HeaderElement extends HTMLElement {
	static uses = define({
		"mu-dropdown": Dropdown.Element
	});

	static template = html`<template>
		<header>
			<h1 style="margin: 0;">
				<button onClick="window.location.href='/'" style="all: unset; cursor: pointer;">
					<slot name="title">Trip Tally</slot>
				</button>
			</h1>
			<nav>
				<mu-dropdown>
					<a slot="actuator">
						Hello,
						<span id="userid"></span>
					</a>
					<menu>
						<li>
							<label class="dark-mode-switch">
								<input type="checkbox" id="dark-mode-toggle"/>
								Dark Mode
							</label>
						</li>
						<li class="when-signed-in">
							<a id="signout">Sign Out</a>
						</li>
						<li class="when-signed-out">
							<a href="/login">Sign In</a>
						</li>
					</menu>
				</mu-dropdown>
			</nav>
		</header>
	</template>`;

	static styles = css`
		:host {
				display: contents;
		}
		header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				background-color: var(--primary-color);
				color: var(--background-color);
				padding: var(--space-md);
				padding-left: var(--space-lg);
				box-shadow: var(--box-shadow);
		}
		header ~ * {
				margin: var(--size-spacing-medium);
		}
		header p {
				--color-link: var(--color-link-inverted);
		}
		header h1 {
				font-family: var(--font-primary);
				font-size: 2.5rem;
				font-style: normal;
				font-weight: 700;
				margin: 0;
				line-height: 60px;
		}
		nav {
				display: flex;
				flex-direction: column;
				flex-basis: max-content;
				align-items: end;
		}
		a[slot="actuator"] {
				font-family: var(--font-primary);
				color: var(--color-link-inverted);
				cursor: pointer;
				padding: var(--space-sm) var(--space-md);
				border-radius: var(--border-radius);
				font-weight: bold;
				text-decoration: none;
				transition: background-color 0.3s ease;
		}
		a[slot="actuator"]:hover {
				background-color: var(--hover-color);
		}
		#userid:empty::before {
				content: "traveler";
				color: var(--color-link-inverted);
		}
		menu {
				background-color: #ffffff; /* White background for visibility */
				box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
				border-radius: var(--border-radius);
				padding: var(--space-sm);
				margin-top: var(--space-xs);
				left: 0;
				z-index: 10;
				color: #333333; /* Dark text for contrast */
		}
		menu li {
				list-style: none;
				margin: var(--space-xs) 0;
				padding: var(--space-xs) var(--space-sm);
		}
		menu li:hover {
				background-color: #f1f1f1; /* Light gray hover background */
				color: #000000; /* Black text on hover */
				border-radius: var(--border-radius);
		}
		menu a {
				color: #1565c0; /* Blue link color */
				text-decoration: none;
				font-weight: normal;
		}
		menu a:hover {
				text-decoration: underline;
		}
		mu-dropdown:hover menu {
				display: block; /* Show menu on hover */
		}
		a:has(#userid:empty) ~ menu > .when-signed-in,
		a:has(#userid:not(:empty)) ~ menu > .when-signed-out {
				display: none;
		}
	`;

	get userid() {
		return this._userid.textContent;
	}

	set userid(id) {
		const useridSpan = this.shadowRoot.querySelector("#userid");
		const signoutButton = this.shadowRoot.querySelector("#signout");
		if (id === "anonymous") {
			useridSpan.textContent = "";
			signoutButton.disabled = true;
		} else {
			useridSpan.textContent = id;
			signoutButton.disabled = false;
		}
	}

	constructor() {
		super();
		shadow(this)
			.template(HeaderElement.template)
			.styles(
				reset.styles,
				headings.styles,
				HeaderElement.styles
			);

		const dm = this.shadowRoot.querySelector(
			".dark-mode-switch"
		);

		dm.addEventListener("click", (event) =>
			Events.relay(event, "dark-mode", {
				checked: event.target.checked
			})
		);

		this._userid = this.shadowRoot.querySelector("#userid");
		this._signout = this.shadowRoot.querySelector("#signout");
		this._darkModeToggle = this.shadowRoot.querySelector("#dark-mode-toggle");

		this._signout.addEventListener("click", (event) =>
			Events.relay(event, "auth:message", ["auth/signout"])
		);
	}

	_authObserver = new Observer(this, "blazing:auth");

	connectedCallback() {
			initializeDarkMode();
			this._authObserver.observe(({ user }) => {
					if (user && user.username !== this.userid) {
					this.userid = user.username;
					}
			});

			this._darkModeToggle.checked = document.body.classList.contains("dark-mode");
			this._darkModeToggle.addEventListener("change", (event) => {
					toggleDarkMode(event.target.checked);
			});
	}

	static initializeOnce() {
		function toggleDarkMode(page, checked) {
			page.classList.toggle("dark-mode", checked);
		}

		document.body.addEventListener("dark-mode", (event) =>
			toggleDarkMode(event.currentTarget, event.detail.checked)
		);
	}
}