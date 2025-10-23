import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IconDeviceDesktopAnalytics, IconHome2, IconCoin, IconFilter } from '@tabler/icons-react';
import { Center, Stack, Tooltip, UnstyledButton } from '@mantine/core';
import ProfitTrackLogo from '../assets/profittrack-text-only.svg';
import classes from '../css/NavbarMinimal.module.css';
function NavbarLink({ icon: Icon, label, active, onClick }) {
    return (<Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton onClick={onClick} className={classes.link} data-active={active || undefined}>
        <Icon size={20} stroke={1.5}/>
      </UnstyledButton>
    </Tooltip>);
}
const mockdata = [
    { icon: IconHome2, label: 'Home', path: '/' },
    { icon: IconCoin, label: 'Expenses', path: '/expenses' },
    { icon: IconFilter, label: 'Filter', path: '/filter' },
    { icon: IconDeviceDesktopAnalytics, label: 'Analytics', path: '/analytics' },
];
export function NavbarMinimal() {
    const navigate = useNavigate();
    const location = useLocation();
    const [active, setActive] = useState(() => {
      const index = mockdata.findIndex((link) => link.path === location.pathname);
      return index >= 0 ? index : 0;
    });
    
    const links = mockdata.map((link, index) => (
        <NavbarLink 
            {...link} 
            key={link.label} 
            active={index === active} 
            onClick={() => {
                setActive(index); 
                navigate(link.path)
            }
        }/>));
    return (<nav className={classes.navbar}>
      <Center>
        <img src={ProfitTrackLogo} alt="ProfitTrack" style={{ width: '100%', maxWidth: 60, height: 'auto' }} />
      </Center>

      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {links}
        </Stack>
      </div>
    </nav>);
}

export default NavbarMinimal