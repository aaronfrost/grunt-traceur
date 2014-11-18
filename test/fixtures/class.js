class Person {

  constructor (name) {
      this.name = name;
  }

  hi () {
      return this.name;
  }

  // Computed property
  get firstInitial() {
    return this.name.slice(0, 1);
  }

}

export class Man extends Person {

  constructor (name) {
      super(name);
  }

  hi () {
      return 'I am a man and my name is ' + super.hi();
  }

}
