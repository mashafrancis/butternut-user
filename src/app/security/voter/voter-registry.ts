import { Injectable } from '@nestjs/common';
import { Voter } from './voter';

@Injectable()
export class VoterRegistry {
  private voters = new Set<Voter>();

  public register(voter: Voter) {
    this.voters.add(voter);
  }

  public getVoters(): IterableIterator<Voter> {
    return this.voters.values();
  }
}
