import { fireEvent, render, screen } from '@testing-library/react';

import LocaleSwitcher from '~components/LocaleSwitcher';
import { setUserLocale } from '~i18n/locale';

// Mock useTranslations và useLocale của next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const dict = {
      'LocaleSwitcher.label': 'Ngôn ngữ',
      'LocaleSwitcher.en': 'English',
      'LocaleSwitcher.vi': 'Tiếng Việt',
    };
    return dict[`LocaleSwitcher.${key}`] || key;
  },
  useLocale: () => 'vi',
}));

// Mock setUserLocale
jest.mock('~i18n/locale', () => ({
  setUserLocale: jest.fn(),
}));

describe('LocaleSwitcher', () => {
  it('renders the correct label and options', () => {
    render(<LocaleSwitcher />);

    expect(screen.getByText('Ngôn ngữ')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveValue('vi');
    expect(screen.getByRole('option', { name: 'English' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Tiếng Việt' })).toBeInTheDocument();
  });

  it('calls setUserLocale when language is changed', () => {
    render(<LocaleSwitcher />);
    const select = screen.getByRole('combobox');

    // Assume the user switches from 'vi' to 'en' 
    fireEvent.change(select, { target: { value: 'en' } });

    expect(setUserLocale).toHaveBeenCalledWith('en');
  });
});
