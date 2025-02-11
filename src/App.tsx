import { useEffect, useState } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { Swap } from 'pages/Swap';
import { Loading } from 'pages/Loading';
import { NotFound } from 'pages/NotFound';
import { UnsupportedNetwork } from 'pages/UnsupportedNetwork';
import { Tokens } from 'pages/Tokens';
import { Pools } from 'pages/earn/pools/Pools';
import { Portfolio } from 'pages/earn/portfolio/Portfolio';
import { Vote } from 'pages/Vote';
import { Fiat } from 'pages/Fiat';
import { LayoutHeader } from 'elements/layoutHeader/LayoutHeader';
import { useAutoConnect } from 'services/web3/wallet/hooks';
import { setUser } from 'services/observables/user';
import { NotificationAlerts } from 'elements/notifications/NotificationAlerts';
import { setNetwork } from 'services/observables/network';
import { Sidebar } from 'elements/sidebar/Sidebar';
import { Slideover } from 'components/slideover/Slideover';
import { useDispatch } from 'react-redux';
import {
  setDarkMode,
  setSlippageTolerance,
  setUsdToggle,
} from 'redux/user/user';
import {
  Notification,
  setNotifications,
} from 'redux/notification/notification';
import { useAppSelector } from 'redux/index';
import { googleTagManager } from 'services/api/googleTagManager';
import { EthNetworks } from 'services/web3/types';
import {
  getAutoLoginLS,
  getDarkModeLS,
  getNotificationsLS,
  getSlippageToleranceLS,
  getUsdToggleLS,
  setNotificationsLS,
} from 'utils/localStorage';
import { loadCommonData } from 'services/observables/triggers';
import { isUnsupportedNetwork } from 'utils/helperFunctions';
import { RewardsClaim } from 'pages/earn/portfolio/rewards/RewardsClaim';
import { RewardsStake } from 'pages/earn/portfolio/rewards/RewardsStake';
import { AddLiquidity } from 'pages/earn/pools/AddLiquidity';

export const App = () => {
  const dispatch = useDispatch();
  const { chainId, account } = useWeb3React();
  const [loading, setLoading] = useState(true);
  const unsupportedNetwork = isUnsupportedNetwork(chainId);
  const triedAutoLogin = useAutoConnect();
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const notifications = useAppSelector<Notification[]>(
    (state) => state.notification.notifications
  );

  useEffect(() => {
    if (chainId || triedAutoLogin || !getAutoLoginLS()) setLoading(false);
  }, [setLoading, chainId, triedAutoLogin]);

  useEffect(() => {
    const usd = getUsdToggleLS();
    if (usd) dispatch(setUsdToggle(usd));

    const notify = getNotificationsLS();
    if (notify) dispatch(setNotifications(notify));

    const slippage = getSlippageToleranceLS();
    if (slippage) dispatch(setSlippageTolerance(slippage));

    loadCommonData(dispatch);

    const dark = getDarkModeLS();
    if (dark) dispatch(setDarkMode(dark));
  }, [dispatch]);

  useEffect(() => {
    setNotificationsLS(notifications);
  }, [notifications]);

  useEffect(() => {
    if (chainId) setNetwork(chainId);
    else setNetwork(EthNetworks.Mainnet);
  }, [chainId]);

  useEffect(() => {
    setUser(account);
    googleTagManager('', '');
  }, [account]);

  return (
    <BrowserRouter>
      <nav className={'hidden md:block'}>
        <Sidebar
          isMinimized={isSidebarMinimized}
          setIsMinimized={setIsSidebarMinimized}
        />
      </nav>
      <nav className={'md:hidden'}>
        <Slideover isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}>
          <div className="w-full w-[200px]">
            <Sidebar
              isMinimized={isSidebarMinimized}
              setIsMinimized={setIsSidebarMinimized}
              setIsSidebarOpen={setIsSidebarOpen}
            />
          </div>
        </Slideover>
      </nav>

      <LayoutHeader
        isMinimized={isSidebarMinimized}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {loading ? (
        <Loading />
      ) : unsupportedNetwork ? (
        <UnsupportedNetwork />
      ) : (
        <div
          className={`md:mr-[30px] pt-[110px] transition-all duration-500 ${
            isSidebarMinimized ? 'md:ml-[96px] ' : 'md:ml-[230px] '
          }`}
        >
          <main className={`max-w-[1400px] mx-auto mb-30`}>
            <Switch>
              <Route exact strict path="/" component={Swap} />
              <Route
                exact
                strict
                path="/eth/swap"
                render={(props) => {
                  return <Redirect to={`/${props.location.search}`} />;
                }}
              />
              <Route exact strict path="/tokens" component={Tokens} />
              <Route exact strict path="/pools" component={Pools} />
              <Route exact strict path="/eth/data">
                <Redirect to="/pools" />
              </Route>
              <Route
                exact
                strict
                path="/pools/add-liquidity/:id"
                component={AddLiquidity}
              />
              <Route
                exact
                strict
                path="/eth/portfolio/stake/add/single/:id"
                render={(props) => (
                  <Redirect
                    to={`/pools/add-liquidity/${props.match.params.id}`}
                  />
                )}
              />
              <Route
                exact
                strict
                path="/eth/pool/add/:id"
                render={(props) => (
                  <Redirect
                    to={`/pools/add-liquidity/${props.match.params.id}`}
                  />
                )}
              />
              <Route exact strict path="/portfolio" component={Portfolio} />
              <Route exact strict path="/eth/portfolio">
                <Redirect to="/portfolio" />
              </Route>
              <Route
                exact
                strict
                path="/portfolio/rewards/claim"
                component={RewardsClaim}
              />
              <Route exact strict path="/eth/portfolio/stake/rewards/withdraw">
                <Redirect to="/portfolio/rewards/claim" />
              </Route>
              <Route
                exact
                strict
                path="/portfolio/rewards/stake/:id"
                component={RewardsStake}
              />
              <Route
                exact
                strict
                path="/eth/portfolio/stake/rewards/restake/:id"
                render={(props) => (
                  <Redirect
                    to={`/portfolio/rewards/stake/${props.match.params.id}`}
                  />
                )}
              />
              <Route exact strict path="/vote" component={Vote} />
              <Route exact strict path="/eth/vote">
                <Redirect to="/vote" />
              </Route>
              <Route exact strict path="/fiat" component={Fiat} />
              <Route exact strict path="/eth/fiat">
                <Redirect to="/fiat" />
              </Route>
              <Route component={NotFound} />
            </Switch>
          </main>
        </div>
      )}
      <NotificationAlerts />
    </BrowserRouter>
  );
};
