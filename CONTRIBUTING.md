# Contributing to Disaster Center Finder

Thank you for considering contributing to the Disaster Center Finder project! We welcome contributions from everyone.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with the following information:
- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Your environment (OS, browser, Node.js version)

### Suggesting Features

We love new ideas! To suggest a feature:
- Create an issue with a clear description
- Explain why this feature would be useful
- Provide examples of how it would work

### Pull Requests

1. **Fork the Repository**
   ```bash
   git clone https://github.com/Tharinda-Pamindu/Sinha-Shakthi-Disaster-Center-finder.git
   cd Sinha-Shakthi-Disaster-Center-finder
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
   or
   ```bash
   git checkout -b fix/your-bug-fix
   ```

3. **Make Your Changes**
   - Write clean, readable code
   - Follow the existing code style
   - Add comments where necessary
   - Test your changes thoroughly

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Add: brief description of your changes"
   ```
   
   Use conventional commit messages:
   - `Add:` for new features
   - `Fix:` for bug fixes
   - `Update:` for updates to existing features
   - `Refactor:` for code refactoring
   - `Docs:` for documentation changes
   - `Style:` for formatting changes

5. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Provide a clear description of your changes
   - Link any related issues

## Development Setup

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Google Maps API key
- Prisma database access

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Add your Google Maps API key and database URL

3. Set up the database:
   ```bash
   npm run prisma:generate
   npm run prisma:push
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## Code Style Guidelines

### TypeScript
- Use TypeScript for all new files
- Define proper types and interfaces
- Avoid using `any` type when possible
- Use meaningful variable and function names

### React Components
- Use functional components with hooks
- Keep components small and focused
- Use proper prop typing
- Follow the existing component structure

### File Organization
- Place components in `components/` directory
- Place API routes in `app/api/` directory
- Place utility functions in `lib/` directory
- Place type definitions in `types/` directory

### CSS/Styling
- Use Tailwind CSS utility classes
- Keep custom CSS minimal
- Follow responsive design principles
- Ensure accessibility (ARIA labels, semantic HTML)

## Testing

Before submitting a pull request:
- Test all new features thoroughly
- Ensure existing functionality still works
- Test on different screen sizes (responsive design)
- Check browser console for errors
- Test geolocation features
- Verify map interactions work correctly

## Database Changes

If your changes involve database schema modifications:
1. Update `prisma/schema.prisma`
2. Generate migration: `npm run prisma:push`
3. Test database changes locally
4. Document the changes in your PR

## API Changes

When modifying or adding API endpoints:
- Follow RESTful conventions
- Add proper error handling
- Return consistent response formats
- Document the endpoint in the PR
- Update README.md if necessary

## Documentation

- Update README.md for significant changes
- Add JSDoc comments for complex functions
- Update API documentation if endpoints change
- Include code examples where helpful

## Questions?

If you have questions about contributing:
- Check existing issues and discussions
- Create a new issue with the "question" label
- Reach out to the maintainers

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers and beginners
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discriminatory language
- Personal attacks
- Trolling or inflammatory comments
- Publishing others' private information
- Any conduct that would be inappropriate in a professional setting

## Recognition

Contributors will be:
- Listed in the project's README
- Credited in release notes
- Acknowledged in the community

## License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Disaster Center Finder! Together we can help communities better prepare for and respond to disasters. 🚨❤️
