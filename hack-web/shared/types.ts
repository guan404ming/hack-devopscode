export type Prettify<T> = { [K in keyof T]: T[K] }
export type MakeOptional<Base, Keys extends keyof Base> = Omit<Base, Keys> & Partial<Pick<Base, Keys>>

export type User<T = string> = {
  _id: T // User ID
  username: string
  sex?: 'Male' | 'Female' | 'Other'
  bio: string
  image?: string
  upvotes: T[] // Array of Post IDs
  downvotes: T[] // Array of Post IDs
  posts: T[] // Array of Post IDs
}

export type Post<T = string> = {
  _id: T // Post ID
  author: T // User ID
  title: string
  content: string
  upvotes: T[] // Array of User IDs
  downvotes: T[] // Array of User IDs
  createdAt: Date
  updatedAt: Date
}

export namespace Users {
  export namespace Get {
    export type Response<T = string> = User<T>[]
  }
}

export namespace User {
  export namespace Post {
    export type Payload = Prettify<
      Pick<User, 'username'> & {
        password: string
      }
    >
    export type Response<T = string> = User<T>
  }
  export namespace Get {
    export type Response<T = string> = User<T>
  }
  export namespace Put {
    export type Payload = Prettify<Omit<MakeOptional<User, 'bio'>, 'upvotes' | 'downvotes' | 'posts'>>
    export type Response<T = string> = User<T>
  }
  export namespace Delete {
    export type Response<T = string> = User<T>
  }
}

type PopulatedPost<T = string> = Omit<Post<T>, 'author'> & { author: Pick<User, '_id' | 'username' | 'image'> }

export namespace Posts {
  export namespace Get {
    export type Response<T = string> = PopulatedPost<T>[]
  }
}

export namespace Post {
  export namespace Post {
    export type Payload = Prettify<Pick<MakeOptional<Post, 'content'>, 'author' | 'title' | 'content'>>
    export type Response<T = string> = PopulatedPost<T>
  }
  export namespace Get {
    export type Response<T = string> = PopulatedPost<T>
  }
  export namespace Put {
    export type Payload = Prettify<Pick<MakeOptional<Post, 'content'>, 'author' | 'title' | 'content'>>
    export type Response<T = string> = PopulatedPost<T>
  }
  export namespace Delete {
    export type Response = void
  }
  export namespace Vote {
    export type Payload = {
      userId: string
    }
    export type Response<T = string> = Post<T>
  }
}
