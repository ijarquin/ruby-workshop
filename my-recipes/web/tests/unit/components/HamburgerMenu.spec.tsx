import { describe, it, expect, vi, afterEach, type Mock } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import HamburgerMenu from "@/components/HamburgerMenu";
import { usePathname } from "next/navigation";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/recipes"),
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    onClick,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
  }) => (
    <a href={href} onClick={onClick} className={className}>
      {children}
    </a>
  ),
}));

afterEach(cleanup);

describe("HamburgerMenu", () => {
  it("displays the mobile menu when it has been clicked", () => {
    render(<HamburgerMenu />);

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));

    expect(screen.getByRole("link", { name: "Home" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Saved Recipes" })).toBeVisible();
    expect(screen.getByRole("link", { name: "About" })).toBeVisible();
  });

  it("closes the menu when clicked while open", () => {
    render(<HamburgerMenu />);

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.getByRole("link", { name: "Home" })).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Close menu" }));

    expect(screen.queryByRole("link", { name: "Home" })).not.toBeInTheDocument();
  });

  it("navigates to the selected menu options when clicked on the option", () => {
    render(<HamburgerMenu />);

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/recipes",
    );
    expect(screen.getByRole("link", { name: "Saved Recipes" })).toHaveAttribute(
      "href",
      "/recipes/favourites",
    );
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "#",
    );
  });

  it("highlights the active link based on the current path", () => {
    (usePathname as Mock).mockReturnValue("/recipes/favourites");
    render(<HamburgerMenu />);

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));

    expect(screen.getByRole("link", { name: "Saved Recipes" })).toHaveClass(
      "text-amber-700",
    );
    expect(screen.getByRole("link", { name: "Home" })).toHaveClass(
      "text-stone-500",
    );
  });

  it("locks body scroll when the menu is opened and restores it when closed", () => {
    render(<HamburgerMenu />);

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.click(screen.getByRole("button", { name: "Close menu" }));
    expect(document.body.style.overflow).toBe("");
  });

  it("closes the menu when a nav link is clicked", () => {
    render(<HamburgerMenu />);

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.getByRole("link", { name: "Home" })).toBeVisible();

    fireEvent.click(screen.getByRole("link", { name: "Home" }));

    expect(screen.queryByRole("link", { name: "Home" })).not.toBeInTheDocument();
  });
});
