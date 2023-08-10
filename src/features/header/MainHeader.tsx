import { useState } from 'react';
import { createStyles, Header, Container, Group, rem, Title, Button } from '@mantine/core';
import { useSelector } from 'react-redux';
import { selectUser } from '../login/currentUserSlice';
import { Link, redirect, useNavigate } from 'react-router-dom';


const useStyles = createStyles((theme) => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },

  links: {
    [theme.fn.smallerThan('xs')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
    },
  },
}));

interface Links {
    link: string, label: string
}

const links: Links[] = [
    {link: "/user", label: "User"},
    {link: "/dashboard", label: "Dashboard"},
    {link: "/clients", label: "Clients"},
    {link: "/settings", label: "Settings"}
]

export default function MainHeader(props) {
  const username = useSelector(selectUser)
  const [active, setActive] = useState(links[0].link);
  const { classes, cx } = useStyles();

  const items = links.map((link) => (
    // <a
    //   key={link.label}
    //   href={link.link}
    //   className={cx(classes.link, { [classes.linkActive]: active === link.link })}
    //   onClick={(event) => {
    //     event.preventDefault();
    //     setActive(link.link);
    //     navigate(link.link)
    //   }}
    // >
    //   {link.label}
    // </a>
    <Button
      component={Link}
      to={link.link}
      variant='subtle'
      key={link.link}
    >
      {link.label}
    </Button>
  ));

  return (
    <>
      <Header height={60} mb={10}>
        <Container className={classes.header}>
          <Title align="center">
            Accounting App 🤓
          </Title>
          {username &&
          <Group spacing={5}>
            {items}
          </Group>
          }
          {username}
        </Container>
      </Header>
      {props.children}
    </>
  );
}