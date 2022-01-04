import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { Vvallet } from '../target/types/vvallet';

describe('vvallet', () => {

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.Vvallet as Program<Vvallet>;

  it('Is initialized!', async () => {
    // Add your test here.
    const tx = await program.rpc.initialize({});
    console.log("Your transaction signature", tx);
  });
});
