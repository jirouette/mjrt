import React, { useState, FormEvent } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { generate } from 'shortid';
import { serverClient } from '../../server';
import './Login.css';

export default function Login() {
    const [nickname, setNickname] = useState('');
    const [socketLost, setSocketLost] = useState(false);
    const [createPrivate, setCreatePrivate] = useState(false);

    const history = useHistory();
    const { id } = useParams();

    const submitLogin = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        localStorage.setItem('nickname', nickname);
        if (!localStorage.getItem('playerId')) {
            localStorage.setItem('playerId', generate());
        }

        if (serverClient.disconnected) {
            setSocketLost(true);
            return;
        }

        setSocketLost(false);

        if (createPrivate) {
            history.push(`/play/${generate()}`);
            return;
        } else if (id) {
            history.push(`/play/${id}`);
            return;
        }

        history.push('/play');
    };

    const displaySocketLost = (
        <div className="login-lost">
            Le serveur est injoignable, veuillez ré-essayer plus tard.
        </div>
    );

    const privateRoom = (
        <div className="login-private">
            <strong>Attention</strong>
            <br />
            Vous allez rejoindre une partie privée !
        </div>
    );

    return (
        <div className="login">
            <div className="login-mjrt">
                <img src="/logo.png" alt="MJRT" width="250" />
            </div>
            <div className="login-content">
                <div className="login-card">
                    {socketLost && displaySocketLost}
                    {Boolean(id) && !socketLost && privateRoom}
                    Une question, trois réponses insensées.
                    <br />
                    Choisissez comme la majorité pour rester en vie.
                    <br />
                    Combien de tours survivrez-vous ?
                    <form onSubmit={submitLogin} className="login-loginForm">
                        <div className="login-oneLine">
                            <input
                                type="text"
                                className="login-nickname"
                                name="nickname"
                                placeholder="Pseudo (2-12 caractères)"
                                pattern="\w{2,12}"
                                required
                                value={nickname}
                                onChange={e => setNickname(e.target.value)}
                                title="Veuillez utiliser entre 2 et 12 caractères alphanumériques"
                            />
                            <input
                                type="submit"
                                value="JOUER !"
                                className="login-submit"
                            />
                        </div>

                        {!Boolean(id) && (
                            <div className="login-privateBox">
                                <input
                                    type="checkbox"
                                    id="private"
                                    checked={createPrivate}
                                    onChange={e =>
                                        setCreatePrivate(!createPrivate)
                                    }
                                />
                                <label htmlFor="private">
                                    Créer une partie privée
                                </label>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
