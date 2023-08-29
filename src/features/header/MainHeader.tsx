import { useEffect, useState } from "react";
import {
  createStyles,
  Header,
  Container,
  Group,
  rem,
  Title,
  Button,
  Grid,
} from "@mantine/core";
import { useSelector } from "react-redux";
import {
  logout,
  selectISAuthenticated,
  selectUser,
} from "../login/currentUserSlice";
import { Link, Outlet, redirect, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchClients } from "../clients/clientsSlice";
import { fetchUsers } from "../user/userSlice";
import { fetchAccountChartTemplates } from "../accountCharts/accountChartsSlice";
import { fetchCategories } from "../categories/categoriesSlice";

const useStyles = createStyles((theme) => ({
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100%",
  },

  links: {
    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
        .color,
    },
  },
}));

interface Links {
  link: string;
  label: string;
}

const links: Links[] = [
  { link: "/user", label: "User" },
  // { link: "/dashboard", label: "Dashboard" },
  { link: "/clients", label: "Clients" },
  { link: "/settings/account-charts", label: "Settings" },
];

export default function MainHeader(props) {
  const isAuthenticated = useSelector(selectISAuthenticated);
  const [active, setActive] = useState(links[0].link);
  const { classes, cx } = useStyles();
  const dispatch = useAppDispatch();

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
    <Button component={Link} to={link.link} variant="subtle" key={link.link}>
      {link.label}
    </Button>
  ));

  const handleLogout = () => {
    dispatch(logout());
  };

  const clientsStatus = useAppSelector((state) => state.clients.status);

  useEffect(() => {
    if (clientsStatus === "idle") {
      dispatch(fetchClients());
    }
  }, [dispatch, clientsStatus]);

  const usersStatus = useAppSelector((state) => state.users.status);

  useEffect(() => {
    if (usersStatus === "idle") {
      dispatch(fetchUsers());
    }
  }, [dispatch, usersStatus]);

  const accountChartsStatus = useAppSelector(
    (state) => state.accountCharts.status
  );

  useEffect(() => {
    if (accountChartsStatus === "idle") {
      dispatch(fetchAccountChartTemplates());
    }
  }, [dispatch, accountChartsStatus]);

  const categoriesStatus = useAppSelector((state) => state.categories.status);

  useEffect(() => {
    if (categoriesStatus === "idle") {
      dispatch(fetchCategories());
    }
  }, [dispatch, categoriesStatus]);

  return (
    <>
      <Header height={60} mb={10}>
        <Grid className={classes.header} justify="space-between">
          <Grid.Col span={8}>
            <Title>Accounting App</Title>
          </Grid.Col>
          <Grid.Col span={4}>
            {isAuthenticated && (
              <>
                <Group spacing={5}>
                  {items}

                  <Button onClick={() => handleLogout()}>Logout</Button>
                </Group>
              </>
            )}
          </Grid.Col>
        </Grid>
      </Header>
      <Outlet />
    </>
  );
}
