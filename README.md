Responsive React Kanban Board
A modern, custom-built task management application. This project features a full Kanban-style workflow including columns, drag-and-drop functionality, and advanced task filtering.

✨ Key Features
Full Drag & Drop: Move tasks between columns or reorder columns using @atlaskit/pragmatic-drag-and-drop.

Task Management: Create, edit, delete, and toggle completion status for tasks.

Bulk Actions: Select multiple tasks to move or delete them at once.

Smart Search: Search tasks by name with visual text highlighting.

Persistent Storage: Your board state is automatically saved to LocalStorage.

Fully Responsive: Designed to work smoothly on mobile and desktop without external UI libraries.

🏗️ Project Structure
src/components: Custom UI elements like Task cards, Columns, and Modals.

src/hooks: Custom logic for LocalStorage and Search.

src/context: State management for the board data.

src/utils: Helpers for drag-and-drop calculations and "smart" search matching.

src/styles: Global and component-specific CSS.

🚀 How to Start
Follow these steps to get the project running locally:

Clone the project

Bash

git clone [your-repository-link]
cd [project-folder-name]
Install dependencies

Bash

npm install
Run the development server

Bash

npm run dev
Once started, open your browser to: http://localhost:5173/