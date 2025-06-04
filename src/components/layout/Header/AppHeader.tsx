// src/components/AppHeader.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    ListItemIcon,
    Box,
    useTheme,
    Tooltip,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Person as PersonIcon,
    Logout as LogoutIcon,
    Notifications as NotificationsIcon,
    SearchRounded,
} from '@mui/icons-material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { User } from '../../../types';
import { styleUtils } from '../../../utils/styleUtils';
import { getAppTitle, getGradeName, menuText } from '../../../utils/appTextUtils';
import CircleIconButton from '../../common/CircleIconButton';
import Separator from '../../common/Separator';
import AvatarAdmin from '../../../assets/avatar-admin.png';
import { useLayout } from '../../../contexts/LayoutContext';


interface AppHeaderProps {
    open: boolean;
    drawerWidth: number;
    user: User | null;
    logout: () => Promise<void>;
    handleDrawerOpen: () => void;
    gradeDetails?: { gradoNombre?: string };
}

const AppHeader: React.FC<AppHeaderProps> = ({
    open,
    drawerWidth,
    user,
    logout,
    handleDrawerOpen,
    gradeDetails,
}) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { headerGrade } = useLayout();
    const location = useLocation();

    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogout = async () => {
        handleCloseUserMenu();
        await logout();
        navigate('/');
    };

    const iconStyles = {
        fontSize: 20,
        fill: theme.palette.grey[100],
        stroke: theme.palette.grey[400],
        strokeWidth: 1.5
    };

    const currentGradeName = headerGrade?.gradoNombre || 
                           gradeDetails?.gradoNombre || 
                           getGradeName(gradeDetails);

    const currentGradeAula = headerGrade?.aula ||
        gradeDetails?.aula ||
                            'No asignada';
    
    const isGradeRoute = location.pathname.includes('/grados/');

    return (
        <AppBar
            position="fixed"
            sx={{
                width: { sm: open ? `calc(100% - ${drawerWidth}px)` : '100%' },
                ml: { sm: open ? `${drawerWidth}px` : 0 },
                transition: theme.transitions.create(['width', 'margin'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                backgroundColor: theme.palette.background.default,
                ...styleUtils.boxShadow(theme, 'low'),
                zIndex: theme.zIndex.drawer + 1,
            }}
        >
            <Toolbar sx={{
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                ...styleUtils.borderRadius('medium')
            }}>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={handleDrawerOpen}
                    sx={{
                        mr: 2,
                        ...(open && { display: 'none' }),
                        ...styleUtils.hoverEffect(theme)
                    }}
                    disableRipple
                >
                    <MenuIcon />
                </IconButton>

                {/* Contenedor para título y grado */}
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    flexGrow: 1,
                    overflow: 'hidden',
                    maxWidth: 'calc(100% - 200px)',
                }}>
                    <Typography
                        variant="h6"
                        noWrap
                        sx={{
                            zIndex: 1,
                            ...styleUtils.gradientText(
                                theme,
                                theme.palette.text.secondary,
                            ),
                            lineHeight: 1.2,
                            fontSize: { xs: '1rem', sm: '1.25rem' }
                        }}
                    >
                        {getAppTitle(user?.role)}
                    </Typography>
                    
                    {isGradeRoute && currentGradeName && (
                        <Typography 
                            variant="subtitle2"
                            sx={{
                                color: theme.palette.grey[600],
                                fontWeight: 'medium',
                                mt: 0.5,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                lineHeight: 1.2,
                                fontSize: { xs: '0.75rem', sm: '0.875rem' }
                            }}
                        >
                            {currentGradeName}
                        </Typography>
                    )}
                    {isGradeRoute && currentGradeAula && (
                        <Typography
                            variant="caption"
                            sx={{
                                color: theme.palette.grey[500],
                                fontWeight: 'medium',
                                mt: 0.5,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                lineHeight: 1.2,
                                fontSize: { xs: '0.65rem', sm: '0.75rem' }
                            }}
                        >
                            Aula: {currentGradeAula}
                        </Typography>
                    )}
                </Box>

                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',  
                    gap: 3, 
                    overflow: 'hidden',
                }}>
                    <CircleIconButton
                        tooltipTitle={menuText.help}
                        icon={<SearchRounded sx={iconStyles} />}
                    />

                    <CircleIconButton
                        tooltipTitle={menuText.notifications}
                        icon={<NotificationsIcon sx={iconStyles} />}
                    />

                    <Separator />

                    <Tooltip title={menuText.profileSettings}>
                        <IconButton
                            onClick={handleOpenUserMenu}
                            sx={{ 
                                p: 0,
                                position: 'relative',
                                '&:hover .dropdown-arrow': {
                                    color: 'primary.main'
                                }
                            }}
                            disableRipple
                        >
                            <Avatar
                                alt={user?.nombre}
                                src={AvatarAdmin}
                                sx={{
                                    bgcolor: theme.palette.primary.main,
                                    color: theme.palette.common.white,
                                    width: 40,
                                    height: 40,
                                    ...styleUtils.boxShadow(theme, 'medium'),
                                    '& img': {
                                        objectFit: 'cover',
                                        width: '100%',
                                        height: '100%'
                                    },
                                    ...styleUtils.hoverEffect(theme)
                                }}
                            >
                                {!AvatarAdmin && user?.nombre?.charAt(0)}
                            </Avatar>
                            <ArrowDropDownIcon
                                className="dropdown-arrow"
                                sx={{
                                    color: 'grey.600',
                                    fontSize: 22,
                                    mt: 0.5,
                                }}
                            />
                        </IconButton>
                    </Tooltip>

                    <Menu
                        sx={{ mt: '45px' }}
                        anchorEl={anchorElUser}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        keepMounted
                    >
                        <MenuItem
                            onClick={() => { handleCloseUserMenu(); navigate('/profile'); }}
                            sx={theme => ({
                                '&:hover': {
                                    backgroundColor: theme.palette.action.hover
                                }
                            })}
                        >
                            <ListItemIcon>
                                <PersonIcon fontSize="small" color="primary" />
                            </ListItemIcon>
                            {menuText.profile}
                        </MenuItem>
                        <MenuItem
                            onClick={handleLogout}
                            sx={theme => ({
                                '&:hover': {
                                    backgroundColor: theme.palette.error.light
                                }
                            })}
                        >
                            <ListItemIcon>
                                <LogoutIcon fontSize="small" color="error" />
                            </ListItemIcon>
                            {menuText.logout}
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default AppHeader;