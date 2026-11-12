"use client";
import FacebookIcon from '@mui/icons-material/FacebookOutlined';
import { styled } from '@mui/material/styles';
import Link from 'next/link';

const FooterRoot = styled('footer')({
  backgroundColor: 'rgba(0, 0, 0, 0.75)',
  color: '#cbd5e1',
});

const FooterContent = styled('div')(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(5),
  maxWidth: '80rem',
  margin: '0 auto',
  padding: theme.spacing(6, 2.5),
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  },
  [theme.breakpoints.up('lg')]: {
    gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
}));

const FooterHeading = styled('h2')({
  color: '#fff',
  fontSize: '0.875rem',
  fontWeight: 700,
  letterSpacing: '0.05em',
  margin: '0 0 1rem',
});

const FooterList = styled('ul')({
  display: 'grid',
  gap: '0.75rem',
  listStyle: 'none',
  margin: 0,
  padding: 0,
  fontSize: '0.875rem',
});

const FooterLink = styled(Link)({
  color: 'inherit',
  textDecoration: 'none',
  transition: 'color 150ms ease',
  '&:hover': {
    color: 'var(--accent)',
  },
});

const SocialLinks = styled('div')({
  display: 'flex',
  gap: '0.75rem',
});

const SocialLink = styled('a')({
  alignItems: 'center',
  color: 'var(--text-subtle)',
  display: 'flex',
  justifyContent: 'center',
  transition: 'background-color 150ms ease',
});

const FooterCopyright = styled('div')({
  color: 'var(--text-subtle)',
  fontSize: '0.75rem',
  padding: '1.25rem 1.25rem',
  textAlign: 'center',
});

function InstagramIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 24 24" width="20">
      <rect height="16" rx="4" stroke="currentColor" strokeWidth="2" width="16" x="4" y="4" />
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" fill="currentColor" r="1" />
    </svg>
  );
}

const columns = [
  { title: "About the store", links: ["About us", "Contact us", "Careers", "Trust & transparency"] },
  { title: "Buy", links: ["How to buy", "Collections", "Loyalty program", "Discounts"] },
  { title: "Help", links: ["FAQ", "How to activate game", "Create a ticket", "Return policy", "Content reporting"] },
  { title: "Community", links: ["Gaming news", "Giveaways", "Become affiliate", "Snakzy: Play and Earn"] },
  { title: "Business", links: ["Sell on the store", "Advertise with us"] },
];

export default function Footer() {
  return (
    <FooterRoot>
      <FooterContent>
        {columns.map((column) => (
          <div key={column.title}>
            <FooterHeading>{column.title}</FooterHeading>
            <FooterList>
              {column.links.map((link) => (
                <li key={link}>
                  <FooterLink href="#">{link}</FooterLink>
                </li>
              ))}
            </FooterList>
          </div>
        ))}
        <div>
          <FooterHeading>Follow Us</FooterHeading>
          <SocialLinks>
            <SocialLink aria-label="Facebook" href="#">
              <FacebookIcon />
            </SocialLink>
            <SocialLink aria-label="Instagram" href="#">
              <InstagramIcon />
            </SocialLink>
          </SocialLinks>
        </div>
      </FooterContent>
      <FooterCopyright>
        No rights reserved. This is application purpose only. All the content belongs to their respective owners.
      </FooterCopyright>
    </FooterRoot>
  );
}
