/* eslint-disable prettier/prettier */
import { INestApplication, ValidationPipe } from '@nestjs/common'
import {Test} from '@nestjs/testing'
import * as pactum from 'pactum'
import { AuthDto } from 'src/auth/dto'
import { AppModule } from '../src/app.module'

const URL = 'http://localhost:1237'

describe('App e2e', ()=>{ 
  let app: INestApplication
  beforeAll(async() =>{
      const moduleRef = await Test.createTestingModule({
          imports: [AppModule]
      }).compile()
      app = moduleRef.createNestApplication()
      app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
      }))
      await app.init()
      await app.listen(1237)

      pactum.request.setBaseUrl('http://localhost:1237')
  })
  afterAll(() =>{
    app.close()
  })

  describe('Auth', ()=>{
      const dto: AuthDto ={
        email: "test@gmail.com",
        password: '123456789'
      }
    describe('Signin', () =>{

    it('Should signin', () =>{
        return pactum.spec().post(`/auth/signin`,).withBody(dto).expectStatus(201)
      })
    })
    describe('Signup', () =>{
      it('Should signup', ()=>{
            return pactum.spec().post('/auth/signup').withBody(dto).expectStatus(403)
      })
    })
  })

  describe('User', () =>{
    describe('Get me', () =>{})
    describe('Edit user', () =>{})
  })

  describe('Bookmarks', ()=>{
    describe('Create bookmark', () =>{})
    describe('Get bookmark', () =>{})
    describe('Create bookmark by id', () =>{})
    describe('Edit bookmark', () =>{})
    describe('Delete bookmark', () =>{})
  })

  it.todo('Should pass')
})