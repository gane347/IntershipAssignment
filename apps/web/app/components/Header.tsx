"use client";

import { useState } from "react";
import Link from "next/link";
import SearchIcon from '@mui/icons-material/Search';
import Image from "next/image";
import MenuIcon from '@mui/icons-material/MenuOutlined';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import LogoImage from "../assets/logoFull.svg";
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCartOutlined';
import FavoriteIcon from '@mui/icons-material/FavoriteBorderOutlined';

const categories = ["Mobile games", "Games", "PSN", "Xbox", "Nintendo"];

const HeaderRoot = styled('header')({
  backgroundColor: '#4618ac',
  padding: '0 20px',
  margin: '0 auto',
});

const HeaderMain = styled('div')(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  gap: theme.spacing(2),
  maxWidth: '80rem',
  margin: '20px 0',
  [theme.breakpoints.up('lg')]: {
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
}));

const MenuButton = styled('button')(({ theme }) => ({
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    color: 'var(--accent)',
    transition: 'background-color 150ms ease, color 150ms ease',
  },
  alignItems: 'center',
  background: 'transparent',
  border: 0,
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  padding: '10px 5px',
  order: -1,
  [theme.breakpoints.up('lg')]: {
    order: 1,
  },
}));

const Logo = styled(Link)({
  flexShrink: 0,
});

const SearchForm = styled('form')(({ theme }) => ({
  display: 'none',
  flex: 1,
  minWidth: '550px',
  maxWidth: '36rem',
  [theme.breakpoints.up('md')]: {
    display: 'block',
  },
}));

const SearchBox = styled('div')({
  alignItems: 'center',
  border: '1px solid #f1f5f9',
  display: 'flex',
  padding: '0 10px',
});

const SearchInput = styled('input')({
  background: 'transparent',
  border: 0,
  flex: 1,
  fontSize: '1rem',
  outline: 0,
  padding: '0.75rem',
  fontWeight: 800,
});

const ButtonNav = styled('nav')({
  alignItems: 'center',
  display: 'flex',
  fontSize: '0.875rem',
  fontWeight: 600,
  gap: '0.75rem',
  marginLeft: 'auto',
});

const HeaderLink = styled('a')({
  '&:hover': {
    color: '#fad318',
  },
  borderRadius: '0.5rem',
  textDecoration: 'none',
  fontWeight: 400,
  fontSize: '14px',
});

const LowerHeader = styled(Box)(() => ({
  backgroundColor: 'rgba(0, 0, 0, 0.25)',
  padding: '0 calc((100% - 1240px) / 2)',
}));


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
    <>
    <HeaderRoot>
      <HeaderMain>

        <Logo href="/">
          <Image src={LogoImage} alt="Eneba" width={155} />
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
        <Box sx={{ width: '150px' }} />
        <ButtonNav>
          <HeaderLink href="/wishlist">
            <FavoriteIcon />
          </HeaderLink>
          <HeaderLink href="/cart">
            <ShoppingCartIcon />
          </HeaderLink>
          <HeaderLink href="/login">
          <PersonOutlinedIcon />
            Log in
          </HeaderLink>
          |
          <HeaderLink href="/register">
            Register
          </HeaderLink>
        </ButtonNav>
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
    
    <LowerHeader>
      <MenuButton
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close categories menu" : "Open categories menu"}
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
        >
          <MenuIcon /> Categories
      </MenuButton>
    </LowerHeader>
    </>
  );
}
