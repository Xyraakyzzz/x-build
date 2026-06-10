import axios from "axios";

export default class xBuild {
  constructor({apikey} = {}) {
    this.baseURL = "https://bfnagdegsgqrrhlurlpc.supabase.co/rest/v1";
    this.apikey = apikey || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmbmFnZGVnc2dxcnJobHVybHBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MTE1NzQsImV4cCI6MjA2OTI4NzU3NH0._RoSCboOxjr3ldxbn_WYPGOCsTADqV6siaS0wVmkBSA";
    this._heroes = null;
  }

  get headers() {
    return {
      apikey: this.apikey,
      authorization: `Bearer ${this.apikey}`
    };
  }

  async getAllHeroes(force=false) {
    if (this._heroes && !force) return this._heroes;

    const {data} = await axios.get(
      `${this.baseURL}/heroes?select=id,name,image_url,roles`,
      {headers:this.headers}
    );

    this._heroes = data;
    return data;
  }

  async searchHero(query) {
    const heroes = await this.getAllHeroes();
    query = query.toLowerCase();
    return heroes.filter(x => x.name.toLowerCase().includes(query));
  }

  async getHero(name) {
    const heroes = await this.getAllHeroes();
    return heroes.find(x => x.name.toLowerCase() === name.toLowerCase());
  }

  async counter(heroName) {
    const hero = await this.getHero(heroName);
    if (!hero) return {status:false,message:"Hero tidak ditemukan"};

    const heroes = await this.getAllHeroes();

    const {data:votes} = await axios.get(
      `${this.baseURL}/counter_pick_votes?select=*&hero_id=eq.${hero.id}`,
      {headers:this.headers}
    );

    const map = {};

    for (const vote of votes) {
      const id = vote.counter_hero_id;
      if (!map[id]) map[id] = {votes:0,reasons:[]};
      map[id].votes++;
      if (vote.reason) map[id].reasons.push(vote.reason);
    }

    const counters = Object.entries(map).map(([id,val]) => {
      const info = heroes.find(h => h.id === id) || {};
      return {
        id,
        hero: info.name || "Unknown",
        image: info.image_url || null,
        roles: info.roles || [],
        votes: val.votes,
        reasons: [...new Set(val.reasons)]
      };
    }).sort((a,b)=>b.votes-a.votes);

    return {status:true,hero:hero.name,totalVotes:votes.length,counters};
  }

  async counteredBy(heroName) {
    const hero = await this.getHero(heroName);
    if (!hero) return {status:false,message:"Hero tidak ditemukan"};

    const heroes = await this.getAllHeroes();

    const {data:votes} = await axios.get(
      `${this.baseURL}/counter_pick_votes?select=*&counter_hero_id=eq.${hero.id}`,
      {headers:this.headers}
    );

    const map = {};

    for (const vote of votes) {
      const id = vote.hero_id;
      if (!map[id]) map[id] = {votes:0,reasons:[]};
      map[id].votes++;
      if (vote.reason) map[id].reasons.push(vote.reason);
    }

    const counteredBy = Object.entries(map).map(([id,val]) => {
      const info = heroes.find(h => h.id === id) || {};
      return {
        id,
        hero: info.name || "Unknown",
        image: info.image_url || null,
        roles: info.roles || [],
        votes: val.votes,
        reasons: [...new Set(val.reasons)]
      };
    }).sort((a,b)=>b.votes-a.votes);

    return {status:true,hero:hero.name,totalVotes:votes.length,counteredBy};
  }
}
