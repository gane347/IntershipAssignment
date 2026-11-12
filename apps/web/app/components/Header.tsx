"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SearchIcon from '@mui/icons-material/Search';
import Image from "next/image";
import MenuIcon from '@mui/icons-material/MenuOutlined';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import LogoImage from "../assets/logoFull.svg";
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCartOutlined';
import FavoriteIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { getCurrentUser, logout, type User } from "@/lib/auth";

const categories = ["All offers","Mobile games", "Games", "PSN", "Xbox", "Nintendo"];

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

const DrawerBackdrop = styled('div')({
  backgroundColor: 'rgba(15, 23, 42, 0.45)',
  inset: 0,
  position: 'fixed',
  zIndex: 10,
});

const CategoriesDrawer = styled('aside')(({ theme }) => ({
  backgroundColor: 'var(--background)',
  boxShadow: '0 10px 30px rgba(15, 23, 42, 0.2)',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  left: 0,
  maxWidth: '22rem',
  overflowY: 'auto',
  padding: theme.spacing(3),
  position: 'fixed',
  top: 0,
  width: '85%',
  zIndex: 11,
}));

const DrawerHeader = styled('div')({
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '2rem',
});

const DrawerCloseButton = styled('button')(({ theme }) => ({
  '&:hover': {
    color: '#e76a8c',
    transition: 'color 150ms ease',
  },
  alignItems: 'center',
  background: 'transparent',
  border: 0,
  borderRadius: theme.shape.borderRadius,
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  padding: theme.spacing(1),
}));

const DrawerList = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
});

const DrawerCategoryLink = styled('a')(({ theme }) => ({
  '&:hover': {
    color: 'var(--accent)',
  },
  fontSize: '1rem',
  fontWeight: 400,
  padding: theme.spacing(0.5),
  textDecoration: 'none',
}));

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    void getCurrentUser().then(setUser);
  }, []);

  async function handleLogout() {
    await logout();
    setUser(null);
  }

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
          {user ? (
            <>
              <HeaderLink href="/account">
                <PersonOutlinedIcon />
                {user.username}
              </HeaderLink>
              <HeaderLink href="/" onClick={(event) => { event.preventDefault(); void handleLogout(); }}>
                Log out
              </HeaderLink>
            </>
          ) : (
            <>
              <HeaderLink href="/login">
                <PersonOutlinedIcon />
                Log in
              </HeaderLink>
              |
              <HeaderLink href="/register">
                Register
              </HeaderLink>
            </>
          )}
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

    </HeaderRoot>

    {menuOpen && (
      <>
        <DrawerBackdrop onClick={() => setMenuOpen(false)} />
        <CategoriesDrawer aria-label="Categories">
          <DrawerHeader>
            <Logo href="/" onClick={() => setMenuOpen(false)}>
              <Image src={LogoImage} alt="Eneba" width={155} />
            </Logo>
            <DrawerCloseButton
              aria-label="Close categories menu"
              onClick={() => setMenuOpen(false)}
              type="button"
            >
              <CloseIcon />
            </DrawerCloseButton>
          </DrawerHeader>
          <DrawerList>
            {categories.map((category) => (
              <DrawerCategoryLink href="#" key={category} onClick={() => setMenuOpen(false)}>
                {category}
              </DrawerCategoryLink>
            ))}
          </DrawerList>
        </CategoriesDrawer>
      </>
    )}
    
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
