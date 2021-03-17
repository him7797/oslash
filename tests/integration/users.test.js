
const request=require('supertest');
const User=require('../../models/user');
let server;

describe('/api/users',()=>{
    beforeEach(()=>{server=require('../../app');});
    afterEach(()=>{server.close();});
    describe('POST /signUp',async()=>{
        let user;
        let name;
        let email;
        let password;
        beforeEach(async () => {
           
            
            name="Himanhsu Upadhyay",
            password="HIM101hi@",
            email="himanshu101hi@gmail.com"
            let newUser={
                name:name,
                password:password,
                email:email
            }
            user=new User(newUser);
            await user.save();
          });
          afterEach(async()=>{
              await User.remove({});
          })
          
          const exec = async () => {
            return  await request(server)
            .post('/api/users/signUp')
            .send({name:name,email:email,password:password});
          }
        it('should return 400 if name length is less than or equal to zero characters',async()=>{
            name='';
            const res=await exec();
            expect(res.status).toBe(400);
        });
        it('should return 400 if email is not properly entered',async()=>{
            email='himgmail.com';
            const res=await exec();
            expect(res.status).toBe(400);
        });
        it('should return 400 if password length is less than 8 characters',async()=>{
            password='1234';
             const res=await exec();
            expect(res.status).toBe(400);
        });
        it('should return 200 if all inputs are valid',async()=>{
            await exec();
            const user1 = await User.find({ email: 'himanshu101hi@gmail.com' });
            expect(user1).not.toBeNull();
        });
       
    });
    describe('POST /logIn',async()=>{
        let user;
        let email;
        let password;
        let id;
        beforeEach(async () => {
           
            password="HIM101hi@",
            email="himanshu101hi@gmail.com"
            let newUser={
                name:"Himanhsu Upadhyay",
                password:"HIM101hi@",
                email:"himanshu101hi@gmail.com"
            }
            user=new User(newUser);
            await user.save();
            id=user._id;
          });
          afterEach(async()=>{
              await User.remove({});
          })
          const exec = async () => {
            return  await request(server)
            .post('/api/users/logIn')
            .send({email:email,password:password});
          }
        
          it('should return 400 if user enters an invalid email',async()=>{
            email="gugfyusgyufgwgmail.com";
            const res=await exec();
            expect(res.status).toBe(400);
        });
            it('should return 404 if user with given email is not present',async()=>{
                email="gugfyusgyufgw@gmail.com";
                const res=await exec();
                expect(res.status).toBe(404);
            });
            
            it('should return 400 if password is wrong',async()=>{
                password='12364649';
                const res=await exec();
                expect(res.status).toBe(400);
            });
            it('should return 200 if successfully logged in ',async()=>{
                const res=await exec();
                expect(res.status).toBe(200);
                expect(res.body.some(g => g.name === 'Himanhsu Upadhyay')).toBeTruthy();
                expect(res.body.some(g => g.email === 'himanshu101hi@gmail.com')).toBeTruthy();
                expect(res.body.some(g=>g._id==id)).toBeTruthy();
            });


    });
});