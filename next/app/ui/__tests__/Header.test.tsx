import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../Header';

describe('Header', () => {
  const user = { email: 'test@test.com' };

  describe('when user is present', () => {
    it('should render the header', () => {
      render(<Header user={user} />);

      const { getByText, getAllByTestId } = within(screen.getByTestId('header'));

      expect(getByText(user.email)).toBeInTheDocument();
      expect(getAllByTestId('link')).toHaveLength(2);
    });
  });

  describe('when user is not present', () => {
    it('should render the header', () => {
      render(<Header user={undefined} />);

      const { getAllByTestId, getByTestId } = within(screen.getByTestId('header'));

      expect(getAllByTestId('link')).toHaveLength(1);
      expect(getByTestId('register-link')).toBeInTheDocument();
      expect(getByTestId('login-link')).toBeInTheDocument();
    });
  });
});
