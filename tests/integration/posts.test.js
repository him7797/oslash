
const request=require('supertest');
const Post=require('../../models/post');
const User=require('../../models/user');
let server;

describe('/api/posts',()=>{
    beforeEach(()=>{server=require('../../app');});
    afterEach(()=>{server.close();});
    describe('POST /',async()=>{
        let user;
        let token;
        let description;
        let postBy;
        let post;
        beforeEach(async () => {
            let newUser={
                name:"Himanhsu Upadhyay",
                password:"HIM101hi@",
                email:"himanshu101hi@gmail.com"
            }
            user=new User(newUser);
            await user.save();
            token=user.generateAuthToken();
            description="Hi there this is testing";
            postBy=user._id;
            let newPost={
            description:description,
            postBy:postBy
            }
            post=new Post(newPost);
            await post.save();
          });
          afterEach(async()=>{
              await User.remove({});
              await Post.remove({});
          })

          const exec = async () => {
            return  await request(server)
            .post('/api/posts/')
            .set('x-auth-token', token)
            .send({description:description});
          }
          it('should return 400 if description length is less than one character',async()=>{
            description='';
            const res=await exec();
            expect(res.status).toBe(400);
        });
        it('should return 401 if token is invalid',async()=>{
            token='';
            const res=await exec();
            expect(res.status).toBe(401);
        });
        it('should return 200 if all input are valid',async()=>{
            const res=await exec();
            expect(res.status).toBe(200);
        });
    });

    describe('GET /byUser',async()=>{
        let user;
        let token;
        let description;
        let postBy;
        let post;
        beforeEach(async () => {
            let newUser={
                name:"Himanhsu Upadhyay",
                password:"HIM101hi@",
                email:"himanshu101hi@gmail.com"
            }
            user=new User(newUser);
            await user.save();
            token=user.generateAuthToken();
            description="Hi there this is testing";
            postBy=user._id;
            let newPost={
            description:description,
            postBy:postBy
            }
            post=new Post(newPost);
            await post.save();
          });
          afterEach(async()=>{
              await User.remove({});
              await Post.remove({});
          })

          const exec = async () => {
            return  await request(server)
            .get('/api/posts/byUser')
            .set('x-auth-token', token)
          }

          it('should return 401 if token is invalid',async()=>{
            token='';
            const res=await exec();
            expect(res.status).toBe(401);
        });
        it('should return 200 if all posts are fetched',async()=>{
            const res=await exec();
            expect(res.status).toBe(200);
        });
    })
    describe('DELETE /:id',async()=>{
        let user;
        let token;
        let description;
        let postBy;
        let post;
        let postId;
        beforeEach(async () => {
            let newUser={
                name:"Himanhsu Upadhyay",
                password:"HIM101hi@",
                email:"himanshu101hi@gmail.com"
            }
            user=new User(newUser);
            await user.save();
            token=user.generateAuthToken();
            description="Hi there this is testing";
            postBy=user._id;
            let newPost={
            description:description,
            postBy:postBy
            }
            post=new Post(newPost);
            await post.save();
            postId=post._id;
          });
          afterEach(async()=>{
              await User.remove({});
              await Post.remove({});
          })

          const exec = async () => {
            return  await request(server)
            .delete('/api/posts/'+postId)
            .set('x-auth-token', token)
          }

          it('should return 401 if token is invalid',async()=>{
            token='';
            const res=await exec();
            expect(res.status).toBe(401);
        });
        it('should return 404 if id is invalid or not found',async()=>{
            postId='1';
            const res=await exec();
            expect(res.status).toBe(404);
        });
        it('should return 200 if post is deleted with given id',async()=>{
            
            const res=await exec();
            expect(res.status).toBe(200);
        });
    })
})