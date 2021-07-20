import React from 'react';

export const UserContext = React.createContext<any>(null);

export function useUser() {
  const [user, setUser] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [loadingToken, setLoadingToken] = React.useState(false);
  const [errorToken, setErrorToken] = React.useState(false);
  const [doneToken, setDoneToken] = React.useState(false);
  const [invalidToken, setInvalidToken] = React.useState(false);
  const [needsToken, setNeedsToken] = React.useState(false);
  const [isLoggedIn, setLoggedIn] = React.useState(false);

  function fetchUser() {
    setLoading(true);
    setError(false);
    setDone(false);
    setNeedsToken(false);
    fetch(`${window._env_.VIVID_BASE_URL}/api/v1/auth/2fa`, {
      method: 'POST',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((result) => {
        let login = false;
        if (result.statusCode === 401) {
          setLoggedIn(false);
        } else if (result.message === 'requireToken') {
          setLoggedIn(false);
          setNeedsToken(true);
        } else if (result.status === true) {
          login = true;
          setLoggedIn(true);
        }
        if (login) {
          fetch(`${window._env_.VIVID_BASE_URL}/api/v1/users/@me`, {
            credentials: 'include',
          })
            .then((res) => res.json())
            .then((user) => {
              setUser(user);
              setLoading(false);
              setDone(true);
            })
            .catch(() => {
              setLoading(false);
              setError(true);
            });
        } else {
          setLoading(false);
          setDone(true);
        }
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }

  function sendToken(token: string) {
    setLoadingToken(true);
    setErrorToken(false);
    setDoneToken(false);
    setInvalidToken(false);
    fetch(`${window._env_.VIVID_BASE_URL}/api/v1/auth/2fa`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        token,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setLoadingToken(false);
        setDoneToken(true);
        if (result.message === 'invalidToken') {
          setInvalidToken(true);
        } else {
          fetchUser();
        }
      })
      .catch(() => {
        setLoadingToken(false);
        setErrorToken(true);
      });
  }

  React.useEffect(() => {
    fetchUser();
  }, []);

  return {
    fetchUser,
    sendToken,
    userState: {
      needsToken,
      error,
      done,
      loading,
    },
    tokenState: {
      error: errorToken,
      loading: loadingToken,
      done: doneToken,
      invalidToken,
    },
    user,
    isLoggedIn,
    updateUser(obj: any) {
      setUser((v) => ({
        ...v,
        ...obj,
      }));
    },
  };
}
