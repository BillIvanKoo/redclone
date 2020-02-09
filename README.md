# redclone
Reddit's clone

### Purpose of this project:
- to learn java with spring boot:
  - authentication/authorisation using jwt.
  - mySQL
  - hibernate/JPA
  - testing using junit.
- to learn react hooks.

### How to run back-end
```bash
cd server/
mvn install
mvn spring-boot:run
```
The server will be run at localhost:8080

### API
|Http Method|Route|Description|Header|Body|Response|
|:-:|:-|:-|-|-|-|
|POST|/users/sign-up|Register a new user||{ username:string, password:string }
|POST|/authenticate|Login||{ username:string, password:string }|JWT for auth
|GET|/posts|Get page of posts|||Page of posts
|GET|/posts/user/:id|Get posts based on user id|||Page of posts
|GET|/posts/parent/:id|Get posts (comments) based on parent id (post that is commented)|||Page of posts
|POST|/posts|Create a post|{ "Authorization": "Bearer " + JWT }|{ "content":string } | the created post
|POST|/posts/parent/:id|Comment on a post with (parent) id|{ "Authorization": "Bearer " + JWT }|{ "content":string }|the created post (commment)
|PUT|/:id|Update post content|{ "Authorization": "Bearer " + JWT }|{ "content":string }|The updated post
|DELETE|/:id|Delete post|{ "Authorization": "Bearer " + JWT }|
|GET|/votes/user/:id|Get votes based on user id|||List of votes
|GET|/votes/post/:id|Get votes based on post id|||List of votes
|POST|/votes/post/:id|Vote on a post (based on id)|{ "Authorization": "Bearer " + JWT }|{ "up":boolean }|the created vote
|PUT|/:id|Edit vote|{ "Authorization": "Bearer " + JWT }|{ "up":boolean }|the edited vote
|DELETE|/:id|Delete vote|{ "Authorization": "Bearer " + JWT }

### Resources used:
- Relationships in spring boot:
  - https://hellokoding.com/jpa-one-to-many-relationship-mapping-example-with-spring-boot-maven-and-mysql/
  - https://www.callicoder.com/hibernate-spring-boot-jpa-one-to-many-mapping-example/
- Security with jwt in spring boot:
  - https://dzone.com/articles/spring-boot-security-json-web-tokenjwt-hello-world
  - https://www.javainuse.com/spring/boot-jwt-mysql
  - https://dev.to/cuongld2/create-apis-with-jwt-authorization-using-spring-boot-24f9
- Testing in Spring Boot:
  - Examples https://howtodoinjava.com/spring-boot2/testing/spring-boot-mockmvc-example/
  - Using @SpringBootTest instead of @WebMvcTest due to application context https://stackoverflow.com/questions/48078044/webmvctest-fails-with-java-lang-illegalstateexception-failed-to-load-applicati
  - Pageable Support https://stackoverflow.com/questions/55448188/spring-boot-pagination-mockito-repository-findallpageable-returns-null
  - Using JWT in tests https://stackoverflow.com/questions/45241566/spring-boot-unit-tests-with-jwt-token-security
  - Mockito Captor https://www.javainuse.com/spring/spring-boot-argumentcaptor