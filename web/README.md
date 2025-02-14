# 112-1-hack1

### Table of Contents

- [Run the project](#run-the-project)
  - [0. Verify Your Versions](#0-verify-your-versions)
  - [1. Clone the Project](#1-clone-the-project)
  - [2. Install Dependencies](#2-install-dependencies)
  - [3. Launch the Project](#3-launch-the-project)
  - [4. Test the Project](#4-test-the-project)
  - [5. Submit the Project](#5-submit-the-project)
- [Project Structure](#project-structure)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Folder Structure](#folder-structure)
- [Grading Rules / Reminders](#grading-rules--reminders)
- [TODOs](#todos)
  - [1. Title and Login Page (34%)](#1-title-and-login-page-34)
  - [2. View Page](#2-view-page)
  - [3. Create Page](#3-create-page)
  - [4. Settings - Profile Page (29%)](#4-settings---profile-page-29)

## Run the project

This project utilizes Yarn as its package manager and comprises both frontend and backend sub-projects. It also makes use of the `concurrently` package to execute multiple commands simultaneously. Below are the steps to run the project:

### 0. Verify Your Versions

```bash
node -v # Ensure it's 18.18.0 (recommended) or compatible (18.x.x)
yarn -v # Ensure it's 1.22.19 (recommended) or compatible (1.x.x)
```

### 1. Clone the Project

Open your terminal and clone the project using the following command:

```bash
cd wp1121 # Enter the wp1121 directory
git clone https://github.com/ntuee-web-programming/112-1-hack1-test.git hack1 # Clone the project
rm -rf hack1/.git # Remove the .git directory
cd hack1 # Enter the project directory
```

### 2. Install Dependencies

To install dependencies for both the frontend and backend sub-projects, use:

```bash
yarn
```

This will concurrently execute the `install:frontend` and `install:backend` scripts.

If preferred, you can also install the dependencies for each sub-project separately.

### 3. Launch the Project

The default port for the frontend is `5173`, while the default port for the backend is `6969`. If you wish to change these ports, you can see `.env.example` for more details. Note that the `PORT` of backend must match the port in `VITE_API_URL` of frontend. You must set the `MONGO_URL` of backend before running the project.

To run the frontend and backend concurrently from the project's root directory, enter:

```bash
yarn dev
```

This will concurrently execute the `dev:frontend` and `dev:backend` scripts.

If preferred, you can also launch the frontend and backend individually.

By adhering to these steps, you should successfully run the project on your local machine.

### 4. Test the Project

We utilize Playwright for testing our project. To run the tests, execute:

```bash
yarn playwright install chromium # Install Chromium (if not already installed)
yarn playwright install-deps chromium # Install Chromium dependencies (if not already installed)
yarn test
```

You should run the test in a separate terminal from the terminal you run your service. Ensure you have launched the project (refer to [step 3](#3-launch-the-project)) before initiating the tests!

Other useful commands for testing include:

```bash
yarn test public-1 # Test tests/public-1.spec.ts only
yarn test --reporter=list # Only show the list of tests
yarn test --headed # Run the tests in a visible browser
yarn test --debug # Shortcut for "--timeout=0 --max-failures=1 --headed --workers=1"
```

### 5. Submit the Project

To ensure you receive full credit for your work, it's essential to submit your project to both Gradescope and GitHub.

> [!IMPORTANT]
> Not pushing your code to GitHub or failing to sign in will result in a 5% deduction from the total score.

To submit the project, here is the recommended workflow:

```bash
git add .
git commit -m "Your commit message"
git archive -o hack1.zip HEAD:hack1 # Create a zip file of your project
git push # Push your code to GitHub
```

Then, upload `hack1.zip` to Gradescope.

## Project Structure

If you're not interested in the project's layout, skip to the [TODOs](#todos) section.

### Frontend

1. **Login Page**:

   <img src="https://github.com/ntuee-web-programming/112-1-unit1-todo-react/assets/74884625/68332b7c-bda7-48b3-abcb-81f197c3fc5b" alt="Login Page" style="max-width: 320px;">

   The login page features both login and register panels with a shared layout found in [`Layout.tsx`](frontend/src/routes/auth/Layout.tsx). Tabs at the top change based on the path name. The layout includes fields for username, password, and confirm password. The confirm password field is hidden in the login panel, so you should remove its `required` attribute. At the page's bottom is a submit button. Depending on the active panel, there's a link to switch between login and registration.

2. **View Page**:

   <img src="https://github.com/ntuee-web-programming/112-1-unit1-todo-react/assets/74884625/e7561d26-953f-45f5-a202-a674e10b4760" alt="View Page" style="max-width: 600px;">

   The view page displays a post with its title, content, author, and timestamp. Navigation buttons allow users to move between posts. Additionally, there are buttons for upvoting and downvoting. If a user has already upvoted, pressing the downvote button will reverse the upvote and then downvote the post. The page should also support keyboard navigation: the left arrow key takes the user to the previous post, while the right arrow key leads to the next one.

3. **Create Page**:

   <img src="https://github.com/ntuee-web-programming/112-1-unit1-todo-react/assets/74884625/0c6d0909-92b4-4b61-9cfc-85fdbb2b2b11" alt="Create Page" style="max-width: 600px;">

   The create page allows users to draft a new post. There's a title field, which is mandatory, and a content field that's optional. <!-- The submit button remains disabled until the title field is populated. After posting, users are directed to view their new content. -->

4. **Settings Page**:

   <img src="https://github.com/ntuee-web-programming/112-1-unit1-todo-react/assets/74884625/b2bc0a5e-919a-4360-bc2e-85d89d7a5e5c" alt="Settings Page" style="max-width: 600px;">

   The settings page provides users with options to personalize their profile. Upon loading, the current user settings are displayed. Here, users can update their username, bio, gender, and profile picture. As selections are made, the user interface reflects these changes in real-time. Notably, when a new profile picture is uploaded, it immediately replaces the current display. If no image is chosen, the existing profile picture remains. If the user never set a picture, the space stays blank.

### Backend

1. The backend structure closely resembles that of the Trello clone app. If you're familiar with its backend code, this should be straightforward. The `models` folder manages both users and posts, while the `controllers` folder handles requests from the frontend. An additional `auth` controller specifically manages login and registration. The `routes` folder oversees all routing, including a unique `init` route to initialize the database during tests.

### Folder Structure

```bash
├── backend
│   ├── src
│   │   ├── controllers # Controllers for handling requests
│   │   │   ├── auth.ts # Controller for login and registration
│   │   │   ├── post.ts # Controller for post-related requests
│   │   │   └── user.ts # Controller for user-related requests
│   │   ├── models # Models for database
│   │   │   ├── post.ts
│   │   │   └── user.ts
│   │   ├── routes # Routes for handling requests
│   │   │   ├── auth.ts # Routes for login and registration
│   │   │   ├── init.ts # Route for initializing database
│   │   │   ├── post.ts
│   │   │   └── user.ts
│   │   ├── errors.ts # Error handling
│   │   ├── index.ts # Entry point
│   │   └── utils.ts # Utility functions
│   ├── .env.example
│   └── package.json
├── frontend
│   ├── public
│   │   └── vscoddit.svg # Vscoddit logo
│   ├── src
│   │   ├── components
│   │   │   ├── ui # UI components. You don't need to modify these.
│   │   │   │   └── ...
│   │   │   ├── PostCard.tsx # Post card component for view page
│   │   │   └── ViewFooter.tsx # Footer component for view page
│   │   ├── contexts
│   │   │   ├── PostContext.tsx # Context for view page
│   │   │   └── UserContext.tsx # Context for user information
│   │   ├── routes
│   │   │   ├── auth
│   │   │   │   ├── Layout.tsx # Layout for login and register pages
│   │   │   │   ├── Login.tsx # Login page: `/login`
│   │   │   │   └── Register.tsx # Register page: `/register`
│   │   │   ├── settings
│   │   │   │   ├── FAQ.tsx # FAQ page: `/settings/faq`
│   │   │   │   ├── Layout.tsx # Layout for settings pages
│   │   │   │   └── Profile.tsx # Profile page: `/settings/profile`
│   │   │   ├── Create.tsx # Create page: `/create`
│   │   │   ├── Layout.tsx # Layout for create and view pages
│   │   │   └── View.tsx # View page: `/view`
│   │   ├── services
│   │   │   ├── postService.ts # Service for post-related requests
│   │   │   └── userService.ts # Service for user-related requests
│   │   ├── App.tsx # Main app component
│   │   ├── globals.css # Global CSS
│   │   ├── main.tsx # Entry point
│   │   └── RootLayout.tsx # Root layout
│   ├── .env.example
│   ├── index.html # Base HTML file
│   └── package.json
├── shared
│   └── types.ts # Shared types
├── tests # Tests using Playwright
│   ├── public-1.spec.ts # Test for public-1
│   ├── public-2.spec.ts # Test for public-2
│   ├── public-3.spec.ts # Test for public-3
│   └── public-4.spec.ts # Test for public-4
├── package.json
└── README.md
```

## Grading Rules / Reminders

- **DO NOT** modify the `className` of any element in the HTML files. This is strictly for styling purposes. No points will be deducted for modifying the `className` attribute, but it's not recommended.
- **DO NOT** modify the `data-testid` attribute of any element in the HTML files. This is solely for testing purposes. If you modify this attribute, your tests may fail.
- You should **NOT** modify files that aren't mentioned in the TODO list. Any modifications to these files will be ignored during grading.
- Even though Gradescope may have graded your code during the test, **you must still push your code** to the main branch of your GitHub repo `wp1211/hack1` before Hack#1 concludes. If necessary, we will review your code. Failing to push the code before the deadline will result in a 5% deduction from the total score.
- If you're wondering where the TODOs are located, utilize the search function in your editor. The TODOs are labeled as `TODO #.#`. For instance, `TODO 1.1` pertains to the first subtask of task 1. If you're using VSCode, the shortcut `Ctrl+Shift+F` (Windows) or `Cmd+Shift+F` (Mac) will help you search for these TODOs. To see all TODOs, use regex `TODO \d\.\d:`. You can also search all warnings by searching for `Warning:`, which you should do before submitting your code.

  ![Visual Studio Code Search](https://github.com/ntuee-web-programming/112-1-unit1-todo-react/assets/74884625/a624e058-8b8a-487d-9f7c-e667b6725abb)

## TODOs

We've laid out four main tasks for you, each containing a series of subtasks. The main tasks are independent of each other. Therefore, if you find yourself stuck on a particular task, feel free to jump to the next. However, some subtasks may rely on the completion of previous ones. For instance, finishing subtask 1.4 is a prerequisite for 1.5. We've indicated which files you'll need to modify for each subtask, arranged in the recommended order of completion. To locate relevant tasks in your editor, simply search for `TODO #.#`.

### 1. Title and Login Page (34%)

- [ ] 1.1 Title and Login Page Title (5%)

  - [`index.html`](frontend/index.html)
  - [`Layout.tsx`](frontend/src/routes/auth/Layout.tsx)

- [ ] 1.2 Redirect to Login Page (5%)

  - [`UserContext.tsx`](frontend/src/contexts/UserContext.tsx)

- [ ] 1.3 Route Configuration for Login and Register Pages (8%)

  - [`Layout.tsx`](frontend/src/routes/auth/Layout.tsx)
  - [`Login.tsx`](frontend/src/routes/auth/Login.tsx)
  - [`Register.tsx`](frontend/src/routes/auth/Register.tsx)

- [ ] 1.4 Login Fails for Unregistered Users (8%)

  - [`Layout.tsx`](frontend/src/routes/auth/Layout.tsx)

- [ ] 1.5 Ensure User Registration Functions Properly (8%)

  - [`Layout.tsx`](frontend/src/routes/auth/Layout.tsx)
  - [`user.ts`](backend/src/controllers/user.ts)

**Hint:** If tasks 1.4 and 1.5 fail but succeeded previously, consider clearing your database and restarting your backend server.

### 2. View Page (40%)

- [ ] 2.1 Render Post With PostCard and PostContext (3%)

  - [`View.tsx`](frontend/src/routes/View.tsx)

- [ ] 2.2 Navigation with `ViewFooter` Buttons (8%)

  - [`View.tsx`](frontend/src/routes/View.tsx)

- [ ] 2.3 Navigation with Keyboard (5%)

  - [`View.tsx`](frontend/src/routes/View.tsx)

- [ ] 2.4 Handle Voting for Unvoted Posts (8%)

  - [`View.tsx`](frontend/src/routes/View.tsx)

- [ ] 2.5 Handle Voting for Voted Posts (16%)

  - [`View.tsx`](frontend/src/routes/View.tsx)
  - [`PostContext.tsx`](frontend/src/contexts/PostContext.tsx)

### 3. Create Page (21%)

- [ ] 3.1 Create a New Post With the Editor (5%)

  - [`Create.tsx`](frontend/src/routes/Create.tsx)

- [ ] 3.2 View User Posts With Files Tab (8%)

  - [`Create.tsx`](frontend/src/routes/Create.tsx)

- [ ] 3.3 Edit User Posts With Editor (8%)

  - [`Create.tsx`](frontend/src/routes/Create.tsx)
  - [`PostContext.tsx`](frontend/src/contexts/PostContext.tsx)

### 4. Settings - Profile Page (29%)

- [ ] 4.1 Render User Information - bio (4%)

  - [`Profile.tsx`](frontend/src/routes/settings/Profile.tsx)

- [ ] 4.2 Render User Information - gender (8%)

  - [`Profile.tsx`](frontend/src/routes/settings/Profile.tsx)

- [ ] 4.3 Render User Information - profile picture 1 (6%)

  - [`Profile.tsx`](frontend/src/routes/settings/Profile.tsx)

- [ ] 4.4 Update User Information (6%)

  - [`user.ts`](backend/src/controllers/user.ts)

- [ ] 4.5 Render User Information - profile picture 2 (5%)

  - [`Profile.tsx`](frontend/src/routes/settings/Profile.tsx)
