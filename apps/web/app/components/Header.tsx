"use client";

import { useState } from "react";
import Link from "next/link";
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/MenuOutlined';
import { styled } from '@mui/material/styles';

const categories = ["Mobile games", "Games", "PSN", "Xbox", "Nintendo"];

const HeaderRoot = styled('header')({
  backgroundColor: '#fff',
  borderBottom: '1px solid #e2e8f0',
});

const HeaderMain = styled('div')(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  gap: theme.spacing(2),
  margin: '0 auto',
  maxWidth: '80rem',
  padding: theme.spacing(2, 2.5),
  [theme.breakpoints.up('lg')]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
}));

const MenuButton = styled('button')(({ theme }) => ({
  '&:hover': {
    backgroundColor: '#f1f5f9',
  },
  alignItems: 'center',
  background: 'transparent',
  border: 0,
  borderRadius: theme.shape.borderRadius,
  color: '#334155',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  order: -1,
  padding: theme.spacing(1),
  [theme.breakpoints.up('lg')]: {
    order: 1,
  },
}));

const Logo = styled(Link)({
  color: '#35c66b',
  flexShrink: 0,
  fontSize: '1.5rem',
  fontWeight: 900,
  letterSpacing: '-0.08em',
  textDecoration: 'none',
});

const SearchForm = styled('form')(({ theme }) => ({
  display: 'none',
  flex: 1,
  maxWidth: '36rem',
  [theme.breakpoints.up('md')]: {
    display: 'block',
  },
}));

const SearchBox = styled('div')({
  '&:focus-within': {
    boxShadow: '0 0 0 2px #35c66b',
  },
  alignItems: 'center',
  backgroundColor: '#f1f5f9',
  borderRadius: '0.5rem',
  color: '#64748b',
  display: 'flex',
  padding: '0 1rem',
});

const SearchInput = styled('input')({
  '&::placeholder': {
    color: '#94a3b8',
  },
  background: 'transparent',
  border: 0,
  color: '#0f172a',
  flex: 1,
  fontSize: '0.875rem',
  outline: 0,
  padding: '0.75rem',
});

const AuthNav = styled('nav')({
  alignItems: 'center',
  color: '#334155',
  display: 'flex',
  fontSize: '0.875rem',
  fontWeight: 600,
  gap: '0.75rem',
  marginLeft: 'auto',
});

const LoginLink = styled('a')({
  '&:hover': {
    backgroundColor: '#f1f5f9',
  },
  borderRadius: '0.5rem',
  color: 'inherit',
  padding: '0.5rem 0.75rem',
  textDecoration: 'none',
});

const RegisterLink = styled('a')({
  '&:hover': {
    backgroundColor: '#2eae5e',
  },
  backgroundColor: '#35c66b',
  borderRadius: '0.5rem',
  color: '#fff',
  padding: '0.5rem 1rem',
  textDecoration: 'none',
});

const MobileSearch = styled('div')(({ theme }) => ({
  borderTop: '1px solid #f1f5f9',
  display: 'block',
  padding: theme.spacing(1.5, 2.5),
  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
}));

const CategoriesNav = styled('nav')({
  backgroundColor: '#f8fafc',
  borderTop: '1px solid #e2e8f0',
});

const CategoriesInner = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  margin: '0 auto',
  maxWidth: '80rem',
  padding: theme.spacing(0.75, 2.5),
  [theme.breakpoints.up('lg')]: {
    flexDirection: 'row',
    gap: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
}));

const CategoryLink = styled('a')(({ theme }) => ({
  '&:hover': {
    color: '#23a956',
  },
  borderBottom: '1px solid #e2e8f0',
  color: '#334155',
  fontSize: '0.875rem',
  fontWeight: 600,
  padding: theme.spacing(1.5, 0),
  textDecoration: 'none',
  '&:last-of-type': {
    borderBottom: 0,
  },
  [theme.breakpoints.up('lg')]: {
    borderBottom: 0,
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
  },
}));

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <HeaderRoot>
      <HeaderMain>
        <MenuButton
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close categories menu" : "Open categories menu"}
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
        >
          <MenuIcon />
        </MenuButton>

        <Logo href="/">
          ENEBA
        </Logo>

        <SearchForm role="search">
          <label className="sr-only" htmlFor="site-search">
            Search
          </label>
          <SearchBox>
            <SearchIcon />
            <SearchInput
              id="site-search"
              placeholder="Search for games, gift cards and more"
              type="search"
            />
          </SearchBox>
        </SearchForm>

        <AuthNav>
          <LoginLink href="/login">
            Log in
          </LoginLink>
          <RegisterLink href="/register">
            Register
          </RegisterLink>
        </AuthNav>
      </HeaderMain>

      <MobileSearch>
        <form role="search">
          <SearchIcon />
          <label className="sr-only" htmlFor="mobile-site-search">
            Search
          </label>
          <SearchBox>
            <SearchInput id="mobile-site-search" placeholder="Search" type="search" />
          </SearchBox>
        </form>
      </MobileSearch>

      {menuOpen && (
        <CategoriesNav aria-label="Categories">
          <CategoriesInner>
            {categories.map((category) => (
              <CategoryLink href="#" key={category}>
                {category}
              </CategoryLink>
            ))}
          </CategoriesInner>
        </CategoriesNav>
      )}
    </HeaderRoot>
  );
}
