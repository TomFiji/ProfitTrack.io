import { IconBook, IconChartPie3, IconChevronDown, IconCode, IconCoin, IconFingerprint, IconNotification, } from '@tabler/icons-react';
import { Anchor, Box, Burger, Button, Center, Collapse, Divider, Drawer, Group, HoverCard, ScrollArea, SimpleGrid, Text, ThemeIcon, UnstyledButton, useMantineTheme, } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { MantineLogo } from '@mantinex/mantine-logo';
import classes from '../css/Header.module.css';
import { useEffect, useState } from 'react';
import { supabase } from './config/supabase'
import ProfitTrackLogo from '../assets/profittrack-text-only.svg'
import { useNavigate, Link, redirect } from 'react-router-dom';

function Header() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const [isEbayConnected, setIsEbayConnected] = useState(null);
  const navigate = useNavigate()
  
  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.log('Error signing out: ', error)
    } else {
      // Clear all browser storage to ensure no cached eBay data persists
      localStorage.clear();
      sessionStorage.clear();
      navigate("/signin")
    }
  }

  async function connectEbayAccount() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No active session');
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/ebay/connect`, {
      headers: {
          'Authorization': `Bearer ${session.access_token}`
      }
    })
    const data = await response.json()
    window.location.href = data.authUrl

  }

  async function checkEbayConnection() {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) return;

    const { data, error } = await supabase
      .from('ebay_connections')
      .select('*')
      .eq('user_id', session.user.id)

    if (error) {
      console.log('Error checking eBay connection:', error);
      return;
    }

    setIsEbayConnected(data && data.length > 0);
  }

  useEffect(() => {
          checkEbayConnection();
          }, []);

  return (
    <Box pb={0}>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <img src={ProfitTrackLogo} width='250px'></img>

          <Group h="100%" gap={0} visibleFrom="sm">
            <a href="/" className={classes.link}>
              Home
            </a>
             <a href="/expenses" className={classes.link}>
              Expenses
            </a>
            <a href="/filter" className={classes.link}>
              Filter
            </a>
            <a href="/analytics" className={classes.link}>
              Analytics
            </a>
          </Group>

          <Group visibleFrom="sm">
            {isEbayConnected === false && (
              <Button id="ebay-button" onClick={connectEbayAccount}>Connect eBay</Button>
            )}
            <Button variant="default" onClick={signOut}>Log out</Button>
          </Group>

          <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
        </Group>
      </header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Menu"
        hiddenFrom="md"
        zIndex={1000000}
      >
        <ScrollArea h="calc(100vh - 80px" mx="-md">
          <Divider my="sm" />

          <a href="/" className={classes.link}>
            Home
          </a>
          <a href="/expenses" className={classes.link}>
            Expenses
          </a>
          <a href="/filter" className={classes.link}>
            Filter
          </a>
          <a href="/analytics" className={classes.link}>
            Analytics
          </a>

          <Divider my="sm" />

          <Group justify="center" grow pb="xl" px="md">
            {isEbayConnected === false && (
              <Button onClick={connectEbayAccount}>Connect eBay</Button>
            )}
            <Button variant="default" onClick={signOut}>Log out</Button>
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}
export default Header

