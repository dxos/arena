//
// Copyright 2020 DXOS.org
//

import { useState, useEffect } from 'react';

import { Registry } from '@wirelineio/registry-client';

const WRN_TYPE_BOT = 'wrn:bot';

// TODO(egorgripasov): Factor out, same code is in examples/dxos-apps.
export const useRegistry = () => {
  const { server, chainId } = { server: 'https://node1.dxos.network/wns/api', chainId: 'wireline' };
  const [registry] = useState(() => new Registry(server, chainId));

  return registry;
};

export const useRegistryBots = () => {
  const registry = useRegistry();

  const [registryBots, setRegistryBots] = useState([]);

  useEffect(() => {
    const queryRegistry = async () => {
      const botsResult = await registry.queryRecords({ type: WRN_TYPE_BOT, version: '*' });
      setRegistryBots(botsResult.map(({ attributes: { version, name, displayName } }) => ({
        version,
        name,
        displayName
      })));
    };

    queryRegistry();
  }, [registry]);

  return registryBots;
};
