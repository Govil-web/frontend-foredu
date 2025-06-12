import React, { useState, useRef, useEffect } from 'react';
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
    TextField,
    InputAdornment,
    Collapse,
    Paper,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Person as PersonIcon,
    Logout as LogoutIcon,
    Notifications as NotificationsIcon,
    SearchRounded,
    Close as CloseIcon,
    ArrowBack
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
    gradeDetails?: { gradoNombre?: string , aula?: string};
    onSearch?: (term: string) => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
                                                 open,
                                                 drawerWidth,
                                                 user,
                                                 logout,
                                                 handleDrawerOpen,
                                                 gradeDetails,
                                                 onSearch,
                                             }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { headerGrade } = useLayout();
    const location = useLocation();
    const searchRef = useRef<HTMLDivElement>(null);

    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setSearchOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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

    const handleSearchClick = () => {
        setSearchOpen(!searchOpen);
        if (!searchOpen) {
            setTimeout(() => {
                const input = searchRef.current?.querySelector('input');
                input?.focus();
            }, 100);
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        onSearch?.(value);
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
    const isAdminRoute = location.pathname.includes('/admin');

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
                    {/* Solo mostrar el título principal si NO estamos en una ruta de grado */}
                    {!isGradeRoute && (
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
                    )}

                    {/* Mostrar información del grado si estamos en una ruta de grado */}
                    {isGradeRoute && currentGradeName && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ArrowBack sx={{
                                fontSize: 'large',
                                color: theme.palette.grey[500],
                                mr: 1,
                                cursor: 'pointer',
                                zIndex: 1,
                                ...styleUtils.hoverEffect(theme)
                            }}
                                       onClick={() => navigate(-1)} />

                            <Typography
                                variant="h5"
                                sx={{
                                    color: theme.palette.text.primary,
                                    fontWeight: 'medium',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    lineHeight: 1.2,
                                    fontSize: { xs: '1rem', sm: '1.25rem' }
                                }}
                            >
                                {currentGradeName} - {currentGradeAula}
                            </Typography>
                        </Box>
                    )}
                </Box>

                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                    overflow: 'hidden',
                    position: 'relative',
                }}>
                    {isAdminRoute && (
                        <Box ref={searchRef}
                             sx={{
                                 position: 'relative',
                                 minWidth: searchOpen ? '300px' : 'auto',
                                 transition: 'min-width 0.3s ease',
                             }}
                        >
                            <CircleIconButton
                                tooltipTitle="Buscar"
                                icon={<SearchRounded sx={iconStyles} />}
                                onClick={handleSearchClick}
                            />
                            <Collapse in={searchOpen} sx={{ position: 'absolute', right: 0, top: '100%', zIndex: theme.zIndex.modal }}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        width: 300,
                                        boxShadow: theme.shadows[8],
                                        border: `1px solid ${theme.palette.divider}`,
                                    }}
                                    elevation={20}
                                >
                                    <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="Buscar por nombre o email..."
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        autoFocus
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchRounded sx={{ color: theme.palette.grey[500] }} />
                                                </InputAdornment>
                                            ),
                                            endAdornment: searchTerm && (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => {
                                                            setSearchOpen(false);
                                                            setSearchTerm('');
                                                            onSearch?.('');
                                                        }}
                                                    >
                                                        <CloseIcon fontSize="small" />
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Paper>
                            </Collapse>
                        </Box>
                    )}

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
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        <MenuItem onClick={handleCloseUserMenu}>
                            <ListItemIcon>
                                <PersonIcon fontSize="small" />
                            </ListItemIcon>
                            Perfil
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                            <ListItemIcon>
                                <LogoutIcon fontSize="small" />
                            </ListItemIcon>
                            Cerrar Sesión
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default AppHeader;