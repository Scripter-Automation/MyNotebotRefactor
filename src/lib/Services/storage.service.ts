
/**
 * @description An object like variable that you wish to commit to local storage
 * wich must contain an expiration date using iteger format. This can be achived by
 * using new Date("your date").getTime();
 */
export interface Item {
  /**
   * @description Any value you wish in a key value pair
   */
  [key:string]:any,
  /**
   * @description The expiration date in integer format
   */
  expiration:number
}

export enum TimeFrame{
  Second="second",
  Minute="minute",
  Hour="hour",
  Day="day",
  Week="week",
  Month="month",
  Year="year"
}


export default class StorageService {

  constructor() { }

  public store(name:string,value:Item):void{
    if(typeof localStorage!=='undefined'){
      localStorage.setItem(name,JSON.stringify(value));
    }
  }
  public get(name:string):Item|null{
    if(typeof localStorage!=='undefined'){
    try{
      const item:Item = JSON.parse(localStorage.getItem(name) as string) as Item;
      return item
    }catch(error){
      console.error(error);
      return null;
    }
    }
    return null;
    
  }

  public delete(name:string):void{
    if(typeof localStorage!=='undefined'){
    localStorage.removeItem(name);
    }
  }

  public handleExpiration(name:string){
    try{
      const item:Item|null = this.get(name);
      if(item && item.expiration && new Date(item.expiration).getTime() < Date.now()){
        this.delete(name)
      }else{
        throw new Error("Item doesn't exists or has an invalid expiration date")
      }
    }catch(error){
      console.error(error)
    }
  }

  public createExpiration(timeFrame:TimeFrame,period:number):number{
    return new Date(Date.now() + period * this.getExpirationTime(timeFrame,period)).getTime();
  }
  
  private getExpirationTime(timeFrame: TimeFrame, period: number): number {
    switch (timeFrame) {
      case TimeFrame.Second:
        return period * 1000;
      case TimeFrame.Minute:
        return period * 60 * 1000;
      case TimeFrame.Hour:
        return period * 60 * 60 * 1000;
      case TimeFrame.Day:
        return period * 24 * 60 * 60 * 1000;
      case TimeFrame.Week:
        return period * 7 * 24 * 60 * 60 * 1000;
      case TimeFrame.Month:
        return period * 30 * 24 * 60 * 60 * 1000;
      case TimeFrame.Year:
        return period * 365 * 24 * 60 * 60 * 1000;
      default:
        throw new Error('Invalid time frame');
    }
  }

  public static DeleteAll(){
    localStorage.clear();
  }
}
