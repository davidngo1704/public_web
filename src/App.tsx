import React, { useEffect, useRef, useState } from 'react';
import { classNames } from 'primereact/utils';
import { Route } from 'react-router-dom'
import AppTopbar from './AppTopbar';
import AppMenu from './AppMenu';
import AppConfig from './AppConfig';
import AppRightMenu from './AppRightMenu';
import { loadThemeConfig, saveThemeConfig } from './utils/themeStorage';
import { Dashboard } from './pages/demo/Dashboard';
import { DashboardV2 } from './pages/demo/DashboardV2';
import { DashboardAnalytics } from './pages/demo/DashboardAnalytics';
import { ButtonDemo } from './pages/demo/ButtonDemo';
import { ChartDemo } from './pages/demo/ChartDemo';
import { MessagesDemo } from './pages/demo/MessagesDemo';
import { Documentation } from './pages/demo/Documentation';
import { FileDemo } from './pages/demo/FileDemo';
import { FormLayoutDemo } from './pages/demo/FormLayoutDemo';
import { InputDemo } from './pages/demo/InputDemo';
import { ListDemo } from './pages/demo/ListDemo';
import { MiscDemo } from './pages/demo/MiscDemo';
import { MenuDemo } from './pages/demo/MenuDemo';
import { OverlayDemo } from './pages/demo/OverlayDemo';
import { PanelDemo } from './pages/demo/PanelDemo';
import { TableDemo } from './pages/demo/TableDemo';
import { TreeDemo } from './pages/demo/TreeDemo';
import { FloatLabelDemo } from './pages/demo/FloatLabelDemo';
import { InvalidStateDemo } from './pages/demo/InvalidStateDemo';
import { DisplayDemo } from './pages/demo/DisplayDemo';
import { ElevationDemo } from './pages/demo/ElevationDemo';
import { FlexBoxDemo } from './pages/demo/FlexboxDemo';
import { GridDemo } from './pages/demo/GridDemo';
import { IconsDemo } from './pages/demo/IconsDemo';
import { SpacingDemo } from './pages/demo/SpacingDemo';
import { TextDemo } from './pages/demo/TextDemo';
import { TypographyDemo } from './pages/demo/TypographyDemo';
import { WidgetsDemo } from './pages/demo/WidgetsDemo';
import { Crud } from './pages/demo/Crud';
import { Calendar } from './pages/demo/Calendar';
import { EmptyPage } from './pages/demo/EmptyPage';
import { Invoice } from './pages/demo/Invoice';
import { Help } from './pages/demo/Help';
import { TimelineDemo } from './pages/demo/TimelineDemo';
import PrimeReact from 'primereact/api';
import httpClient from './utils/htttpClient';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './App.scss';

export const RTLContext = React.createContext(false);

const App = () => {
    // Load theme config from localStorage on initial mount
    const initialConfig = loadThemeConfig();
    
    const [menuMode, setMenuMode] = useState(initialConfig.menuMode);
    const [inlineMenuPosition, setInlineMenuPosition] = useState(initialConfig.inlineMenuPosition);
    const [desktopMenuActive, setDesktopMenuActive] = useState(true);
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const [activeTopbarItem, setActiveTopbarItem] = useState(null);
    const [colorMode, setColorMode] = useState(initialConfig.colorMode);
    const [rightMenuActive, setRightMenuActive] = useState(false);
    const [menuActive, setMenuActive] = useState(false);
    const [inputStyle, setInputStyle] = useState(initialConfig.inputStyle);
    const [isRTL, setRTL] = useState<boolean>(initialConfig.isRTL);
    const [ripple, setRipple] = useState(initialConfig.ripple);
    const [mobileTopbarActive, setMobileTopbarActive] = useState(false);
    const [menuTheme, setMenuTheme] = useState(initialConfig.menuTheme);
    const [topbarTheme, setTopbarTheme] = useState(initialConfig.topbarTheme);
    const [theme, setTheme] = useState(initialConfig.theme);
    const [isInputBackgroundChanged, setIsInputBackgroundChanged] = useState(false);
    const [inlineMenuActive, setInlineMenuActive] = useState<any>({});
    const [newThemeLoaded, setNewThemeLoaded] = useState(false);
    const [searchActive, setSearchActive] = useState(false)
    let currentInlineMenuKey = useRef('');
    PrimeReact.ripple = initialConfig.ripple;
    let searchClick: boolean;
    let topbarItemClick: boolean;
    let menuClick: boolean;
    let inlineMenuClick: boolean;
    useEffect(() => {
        if (menuMode === 'overlay') {
            hideOverlayMenu()
        }
        if (menuMode === 'static') {
            setDesktopMenuActive(true)
        }
    }, [menuMode]);
    
    const [menu, setMenu] = useState<any>([]);

    useEffect(() => {

        (async () => {
            let dataRes = await httpClient.getMethod("file/download-text?filepath=D%3A%2F%2FApiGateway%5Cdata%5Cconfig%5Cmenu.json");

            setMenu(JSON.parse(dataRes));
        })();

        onColorModeChange(colorMode);
    }, [])

    useEffect(() => {
        saveThemeConfig({
            menuMode,
            inlineMenuPosition,
            colorMode,
            inputStyle,
            isRTL,
            ripple,
            menuTheme,
            topbarTheme,
            theme
        });
    }, [menuMode, inlineMenuPosition, colorMode, inputStyle, isRTL, ripple, menuTheme, topbarTheme, theme]);
    const onMenuThemeChange = (theme: any) => {
        setMenuTheme(theme)
    }
    const onTopbarThemeChange = (theme: string) => {
        setTopbarTheme(theme);
    }
    useEffect(() => {
        const appLogoLink = (document.getElementById('app-logo') as HTMLInputElement);

        if (topbarTheme === 'white' || topbarTheme === 'yellow' || topbarTheme === 'amber' || topbarTheme === 'orange' || topbarTheme === 'lime') {
            appLogoLink.src = 'assets/layout/images/logo-light.svg';
        }
        else {
            appLogoLink.src = 'assets/layout/images/logo-light.svg';
        }
    }, [topbarTheme])
    const onThemeChange = (theme: string) => {
        setTheme(theme);
        const themeLink = document.getElementById('theme-css');
        const themeHref = 'assets/theme/' + theme + '/theme-' + colorMode + '.css';
        replaceLink(themeLink, themeHref);
    }
    const onColorModeChange = (mode: any) => {
        setColorMode(mode);
        setIsInputBackgroundChanged(true);

        if (isInputBackgroundChanged) {
            if (mode === 'dark') {
                setInputStyle('filled');
            } else {
                setInputStyle('outlined')
            }
        }

        if (mode === 'dark') {
            setMenuTheme('dark');
            setTopbarTheme('dark');
        } else {
            setMenuTheme('light');
            setTopbarTheme('blue');
        }

        const layoutLink = document.getElementById('layout-css');
        const layoutHref = 'assets/layout/css/layout-' + mode + '.css';
        replaceLink(layoutLink, layoutHref);

        const themeLink = (document.getElementById('theme-css') as HTMLInputElement);
        const urlTokens = (themeLink.getAttribute('href') as String).split('/');
        urlTokens[urlTokens.length - 1] = 'theme-' + mode + '.css';
        const newURL = urlTokens.join('/');

        replaceLink(themeLink, newURL, () => {
            setNewThemeLoaded(true);
        });

    }
    const replaceLink = (linkElement: any, href: string, callback?: any) => {
        if (isIE()) {
            linkElement.setAttribute('href', href);

            if (callback) {
                callback();
            }
        }
        else {
            const id = linkElement.getAttribute('id');
            const cloneLinkElement = linkElement.cloneNode(true);

            cloneLinkElement.setAttribute('href', href);
            cloneLinkElement.setAttribute('id', id + '-clone');

            linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);

            cloneLinkElement.addEventListener('load', () => {
                linkElement.remove();
                cloneLinkElement.setAttribute('id', id);

                if (callback) {
                    callback();
                }
            });
        }
    }

    const onInputStyleChange = (inputStyle: string) => {
        setInputStyle(inputStyle);
    }

    const onRipple = (e: any) => {
        PrimeReact.ripple = e.value;
        setRipple(e.value);
    }

    const onInlineMenuPositionChange = (mode: string) => {
        setInlineMenuPosition(mode)
    }

    const onMenuModeChange = (mode: string) => {
        setMenuMode(mode);
    }

    const onRTLChange = () => {
        setRTL(prevState => !prevState);
    }

    const onMenuClick = (event: any) => {
        menuClick = true;
    }

    const onMenuButtonClick = (event: Event) => {
        menuClick = true;

        if (isDesktop())
            setDesktopMenuActive((prevState) => !prevState);
        else
            setMobileMenuActive((prevState) => !prevState)

        event.preventDefault();

    }

    const onTopbarItemClick = (event: any) => {
        topbarItemClick = true;
        if (activeTopbarItem === event.item)
            setActiveTopbarItem(null)
        else {
            setActiveTopbarItem(event.item)
        }

        event.originalEvent.preventDefault();
    }

    const onSearch = (event: any) => {
        searchClick = true;
        setSearchActive(event);
    }

    const onMenuItemClick = (event: any) => {
        if (!event.item.items && (menuMode === 'overlay' || !isDesktop())) {
            hideOverlayMenu();
        }

        if (!event.item.items && (isHorizontal() || isSlim())) {
            setMenuActive(false)
        }
    }

    const onRootMenuItemClick = (event: any) => {
        setMenuActive((prevState) => !prevState);
    }

    const onRightMenuButtonClick = () => {
        setRightMenuActive((prevState) => !prevState)
    }

    const onMobileTopbarButtonClick = (event: any) => {
        setMobileTopbarActive((prevState) => !prevState);
        event.preventDefault();
    }

    const onDocumentClick = (event: any) => {
        if (!searchClick && event.target.localName !== 'input') {
            setSearchActive(false);
        }

        if (!topbarItemClick) {
            setActiveTopbarItem(null);
        }

        if (!menuClick && (menuMode === 'overlay' || !isDesktop())) {
            if (isHorizontal() || isSlim()) {
                setMenuActive(false)
            }
            hideOverlayMenu();
        }

        if (inlineMenuActive[currentInlineMenuKey.current] && !inlineMenuClick) {
            let menuKeys = { ...inlineMenuActive };
            menuKeys[currentInlineMenuKey.current] = false;
            setInlineMenuActive(menuKeys);
        }

        if (!menuClick && (isSlim() || isHorizontal())) {
            setMenuActive(false);
        }

        searchClick = false;
        topbarItemClick = false;
        inlineMenuClick = false;
        menuClick = false;
    }

    const hideOverlayMenu = () => {
        setMobileMenuActive(false)
        setDesktopMenuActive(false)
    }

    const isDesktop = () => {
        return window.innerWidth > 1024;
    }

    const isHorizontal = () => {
        return menuMode === 'horizontal';
    }

    const isSlim = () => {
        return menuMode === 'slim';
    }

    const isIE = () => {
        return /(MSIE|Trident\/|Edge\/)/i.test(window.navigator.userAgent)
    }

    const onInlineMenuClick = (e: any, key: any) => {
        let menuKeys = { ...inlineMenuActive };
        if (key !== currentInlineMenuKey.current && currentInlineMenuKey.current) {
            menuKeys[currentInlineMenuKey.current] = false;
        }

        menuKeys[key] = !menuKeys[key];
        setInlineMenuActive(menuKeys);
        currentInlineMenuKey.current = key;
        inlineMenuClick = true;
    }

    const layoutContainerClassName = classNames('layout-wrapper ', 'layout-menu-' + menuTheme + ' layout-topbar-' + topbarTheme, {
        'layout-menu-static': menuMode === 'static',
        'layout-menu-overlay': menuMode === 'overlay',
        'layout-menu-slim': menuMode === 'slim',
        'layout-menu-horizontal': menuMode === 'horizontal',
        'layout-menu-active': desktopMenuActive,
        'layout-menu-mobile-active': mobileMenuActive,
        'layout-topbar-mobile-active': mobileTopbarActive,
        'layout-rightmenu-active': rightMenuActive,
        'p-input-filled': inputStyle === 'filled',
        'p-ripple-disabled': !ripple,
        'layout-rtl': isRTL
    });


    return (
        <RTLContext.Provider value={isRTL}>
            <div className={layoutContainerClassName} onClick={onDocumentClick}>
                <AppTopbar horizontal={isHorizontal()}
                    activeTopbarItem={activeTopbarItem}
                    onMenuButtonClick={onMenuButtonClick}
                    onTopbarItemClick={onTopbarItemClick}
                    onRightMenuButtonClick={onRightMenuButtonClick}
                    onMobileTopbarButtonClick={onMobileTopbarButtonClick} mobileTopbarActive={mobileTopbarActive}
                    searchActive={searchActive} onSearch={onSearch} />

                <div className="menu-wrapper" onClick={onMenuClick}>
                    <div className="layout-menu-container">
                        <AppMenu model={menu} onMenuItemClick={onMenuItemClick} onRootMenuItemClick={onRootMenuItemClick} menuMode={menuMode} active={menuActive} />
                    </div>
                </div>

                <div className="layout-main">

                    <div className="layout-content">
                        <Route path="/" exact render={() => <DashboardV2 colorMode={colorMode} isNewThemeLoaded={newThemeLoaded} onNewThemeChange={(e: any) => setNewThemeLoaded(e)} />} />
                        <Route path="/chat" render={() => <Dashboard colorMode={colorMode} isNewThemeLoaded={newThemeLoaded} onNewThemeChange={(e: any) => setNewThemeLoaded(e)} />} />
                        <Route path="/start/documentation" component={Documentation} />
                        <Route path="/phong_tro" render={() => <DashboardAnalytics colorMode={colorMode} isNewThemeLoaded={newThemeLoaded} onNewThemeChange={(e: any) => setNewThemeLoaded(e)} />} />
                        <Route path="/uikit/formlayout" component={FormLayoutDemo} />
                        <Route path="/source" component={TreeDemo} />
                        <Route path="/config" component={InputDemo} />
                        <Route path="/uikit/floatlabel" component={FloatLabelDemo} />
                        <Route path="/uikit/invalidstate" component={InvalidStateDemo} />
                        <Route path="/uikit/button" component={ButtonDemo} />
                        <Route path="/uikit/table" component={TableDemo} />
                        <Route path="/uikit/list" component={ListDemo} />
                        <Route path="/uikit/panel" component={PanelDemo} />
                        <Route path="/uikit/overlay" component={OverlayDemo} />
                        <Route path="/uikit/menu" component={MenuDemo} />
                        <Route path="/uikit/message" component={MessagesDemo} />
                        <Route path="/uikit/file" component={FileDemo} />
                        <Route path="/uikit/chart" render={() => <ChartDemo colorMode={colorMode} isNewThemeLoaded={newThemeLoaded} onNewThemeChange={(e: any) => setNewThemeLoaded(e)} />} />
                        <Route path="/uikit/misc" component={MiscDemo} />
                        <Route path="/utilities/display" component={DisplayDemo} />
                        <Route path="/utilities/elevation" component={ElevationDemo} />
                        <Route path="/utilities/flexbox" component={FlexBoxDemo} />
                        <Route path="/utilities/icons" component={IconsDemo} />
                        <Route path="/utilities/widgets" render={() => <WidgetsDemo colorMode={colorMode} isNewThemeLoaded={newThemeLoaded} onNewThemeChange={(e: any) => setNewThemeLoaded(e)} />} />
                        <Route path="/utilities/grid" component={GridDemo} />
                        <Route path="/utilities/spacing" component={SpacingDemo} />
                        <Route path="/utilities/typography" component={TypographyDemo} />
                        <Route path="/utilities/text" component={TextDemo} />
                        <Route path="/pages/crud" component={Crud} />
                        <Route path="/pages/calendar" component={Calendar} />
                        <Route path="/pages/help" component={Help} />
                        <Route path="/pages/invoice" component={Invoice} />
                        <Route path="/pages/empty" component={EmptyPage} />
                        <Route path="/pages/timeline" component={TimelineDemo} />

                    </div>

                </div>

                <AppConfig inputStyle={inputStyle} onInputStyleChange={onInputStyleChange}
                    rippleEffect={ripple} onRippleEffect={onRipple}
                    menuMode={menuMode} onMenuModeChange={onMenuModeChange}
                    inlineMenuPosition={inlineMenuPosition} onInlineMenuPositionChange={onInlineMenuPositionChange}
                    colorMode={colorMode} onColorModeChange={onColorModeChange}
                    menuTheme={menuTheme} onMenuThemeChange={onMenuThemeChange}
                    topbarTheme={topbarTheme} onTopbarThemeChange={onTopbarThemeChange}
                    theme={theme} onThemeChange={onThemeChange}
                    isRTL={isRTL} onRTLChange={onRTLChange} />

                <AppRightMenu rightMenuActive={rightMenuActive} onRightMenuButtonClick={onRightMenuButtonClick} />

                {mobileMenuActive && <div className="layout-mask modal-in"></div>}
            </div>
        </RTLContext.Provider>
    );

}

export default App;
