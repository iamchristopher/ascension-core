import moves from './moves';

const players = {
    736657283125056: {
        name: 'One',
        maxHealth: 50,
        currentHealth: 50,
        position: {
            x: 50,
            y: 50
        },
        speed: 5,
        activations: 0
    },
    2097982960243625: {
        name: 'Two',
        maxHealth: 50,
        currentHealth: 50,
        position: {
            x: 100,
            y: 50
        },
        speed: 5,
        activations: 0
    }
};

const pawns = {
    1: {
        owner: 736657283125056,
        maxHealth: 50,
        currentHealth: 50,
        position: {
            x: 50,
            y: 50
        },
        speed: 5,
        activations: 0,
        active: false
    },
    2: {
        owner: 2097982960243625,
        maxHealth: 50,
        currentHealth: 50,
        position: {
            x: 250,
            y: 50
        },
        speed: 5,
        activations: 0,
        active: false
    },
    3: {
        owner: 736657283125056,
        maxHealth: 50,
        currentHealth: 50,
        position: {
            x: 250,
            y: 200
        },
        speed: 5,
        activations: 0,
        active: true
    }
};

export default {
    name: 'ascension',
    setup: () => ({
        players,
        pawns
    }),
    moves,
    flow: {
        onTurnEnd (G, ctx) {
            return modifyPlayer(G, ctx.currentPlayer, {
                activations: 0
            });
        },
        phases: [
            {
                name: 'Activation',
                allowedMoves: [],
                onPhaseEnd (G, ctx) {
                    const currentPlayer = G.players[ctx.currentPlayer];

                    return modifyPlayer(G, ctx.currentPlayer, {
                        activations: currentPlayer.activations + 1
                    });
                },
                endTurnIf (G, ctx) {
                    const currentPlayer = G.players[ctx.currentPlayer];

                    return currentPlayer.activations >= 2;
                }
            },
            {
                name: 'Movement',
                allowedMoves: [ 'movePawn' ],
                onPhaseBegin (G, ctx) {
                    const currentPlayer = G.players[ctx.currentPlayer];

                    return modifyPlayer(G, ctx.currentPlayer, {
                        actions: currentPlayer.speed
                    });
                },
                onMove (G, ctx) {
                    const currentPlayer = G.players[ctx.currentPlayer];

                    return modifyPlayer(G, ctx.currentPlayer, {
                        actions: currentPlayer.actions - 1
                    });
                },
                endPhaseIf (G, ctx) {
                    const currentPlayer = G.players[ctx.currentPlayer];

                    return currentPlayer.actions <= 0 && 'Activation';
                },
                onPhaseEnd (G, ctx) {
                    const currentPlayer = G.players[ctx.currentPlayer];

                    return modifyPlayer(G, ctx.currentPlayer, {
                        actions: 0,
                        activations: currentPlayer.actions === currentPlayer.speed
                            ?   currentPlayer.activations - 1
                            :   currentPlayer.activations
                    });
                }
            },
            {
                name: 'Attack',
                allowedMoves: [ 'attackPawn' ],
                onPhaseBegin (G, ctx) {
                    return modifyPlayer(G, ctx.currentPlayer, {
                        actions: 1
                    });
                },
                onMove (G, ctx) {
                    const currentPlayer = G.players[ctx.currentPlayer];

                    return modifyPlayer(G, ctx.currentPlayer, {
                        actions: currentPlayer.actions - 1
                    });
                },
                endPhaseIf (G, ctx) {
                    const currentPlayer = G.players[ctx.currentPlayer];

                    return currentPlayer.actions <= 0 && 'Activation';
                },
                onPhaseEnd (G, ctx) {
                    const currentPlayer = G.players[ctx.currentPlayer];

                    return modifyPlayer(G, ctx.currentPlayer, {
                        actions: 0,
                        activations: currentPlayer.actions === 1
                            ?   currentPlayer.activations - 1
                            :   currentPlayer.activations
                    });
                }
            }
        ],
        playOrder: Object.keys(players)
    }
};

const modifyPlayer = (G, id, props) => ({
    ...G,
    players: {
        ...G.players,
        [id]: {
            ...G.players[id],
            ...props
        }
    }
});