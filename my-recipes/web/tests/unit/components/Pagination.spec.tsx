import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import Pagination from '@/components/Pagination';

afterEach(cleanup);

const defaultProps = {
  currentPage: 1,
  totalPages: 5,
  onPageChange: vi.fn(),
};

describe('Pagination', () => {
  it('renders nothing when totalPages is 1', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when totalPages is 0', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={0} onPageChange={vi.fn()} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('displays the current page and total pages', () => {
    render(<Pagination {...defaultProps} currentPage={3} totalPages={5} />);

    expect(screen.getByText('Page 3 of 5')).toBeInTheDocument();
  });

  it('disables the Prev button on the first page', () => {
    render(<Pagination {...defaultProps} currentPage={1} />);

    expect(screen.getByRole('button', { name: /prev/i })).toBeDisabled();
  });

  it('disables the Next button on the last page', () => {
    render(<Pagination {...defaultProps} currentPage={5} totalPages={5} />);

    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
  });

  it('enables both buttons when on a middle page', () => {
    render(<Pagination {...defaultProps} currentPage={3} />);

    expect(screen.getByRole('button', { name: /prev/i })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: /next/i })).not.toBeDisabled();
  });

  it('calls onPageChange with the previous page when Prev is clicked', () => {
    const onPageChange = vi.fn();
    render(<Pagination {...defaultProps} currentPage={3} onPageChange={onPageChange} />);

    fireEvent.click(screen.getByRole('button', { name: /prev/i }));

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange with the next page when Next is clicked', () => {
    const onPageChange = vi.fn();
    render(<Pagination {...defaultProps} currentPage={3} onPageChange={onPageChange} />);

    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    expect(onPageChange).toHaveBeenCalledWith(4);
  });
});
