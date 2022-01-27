use gold;

-- --DROP Tables
drop table if exists user_info;
drop table if exists user_connection;
drop table if exists reward_type_master_table; 
drop table if exists reward_master_table;
drop table if exists product_master_table;
drop table if exists context_master_table;
drop table if exists feed;
drop table if exists feed_summary
drop table if exists feed_engagement;
drop table if exists user_activity;
drop table if exists category_following 
drop table if exists user_following 
drop table if exists user_rewards_earn
drop table if exists reward_redemption_table
drop table if exists user_filter_summary
drop table if exists user_details_summary 

-- --Create Tables


create table if not exists user_info (user_id bigint NOT NULL PRIMARY KEY , user_name varchar(255) NOT NULL, user_profile_image varchar(255), user_phone_number varchar(32), user_gender varchar(10), user_email varchar(100), user_dob date, expo_token varchar(255), device_token varchar(255), instagram_user_name varchar(255), country_name varchar(32), state_name varchar(32), city_name varchar(32), pin_code bigint , created_at timestamp DEFAULT CURRENT_TIMESTAMP );




create table if not exists feed (user_name varchar(255) NOT NULL , user_id bigint NOT NULL, feed_id bigint NOT NULL PRIMARY KEY AUTO_INCREMENT, user_image varchar(255), category_id int, category_name varchar(255), context_id int, context_name varchar(255), product_id int , product_name varchar(255), access_control varchar(32), feed_image varchar(255), buy_url varchar(1000), comment varchar(10000) , created_at timestamp DEFAULT CURRENT_TIMESTAMP );




create table if not exists user_activity (user_name varchar(255) NOT NULL , user_id bigint NOT NULL, feed_id bigint NOT NULL, activity_id bigint NOT NULL PRIMARY KEY AUTO_INCREMENT, activity_like boolean , activity_dislike boolean , activity_buy int, created_at timestamp DEFAULT CURRENT_TIMESTAMP );



create table if not exists user_connection (user_name varchar(255) NOT NULL, user_id bigint NOT NULL, connection_phone_number varchar(32) , connection_id bigint NOT NULL PRIMARY KEY AUTO_INCREMENT, updated_at timestamp DEFAULT CURRENT_TIMESTAMP);
create table if not exists feed_engagement (feed_id bigint PRIMARY KEY NOT NULL, feed_count_likes int, feed_count_dislikes int , feed_count_buys INT , updated_at timestamp DEFAULT CURRENT_TIMESTAMP);



create table if not exists reward_type_master_table (reward_type_id int NOT NULL PRIMARY KEY AUTO_INCREMENT, reward_type varchar(255) NOT NULL, coins_value int NOT NULL , created_at timestamp DEFAULT CURRENT_TIMESTAMP);



create table if not exists reward_master_table (reward_id int NOT NULL PRIMARY KEY AUTO_INCREMENT, company_name varchar(255) NOT NULL, company_logo varchar(255), coins_value int NOT NULL , cash_value int NOT NULL , created_at timestamp DEFAULT CURRENT_TIMESTAMP);



create table if not exists product_master_table (category_id int, category_name varchar(255), product_id int NOT NULL PRIMARY KEY AUTO_INCREMENT, product_name varchar (255), product_image varchar(255), created_at timestamp DEFAULT CURRENT_TIMESTAMP);



create table if not exists context_master_table (category_id int, category_name varchar(255), context_id int NOT NULL PRIMARY KEY AUTO_INCREMENT, context_name varchar (255), context_image varchar(255), created_at timestamp DEFAULT CURRENT_TIMESTAMP);



create table if not exists feed_summary (category_id int, category_name varchar(255), context_id int , context_name varchar (255), product_id int , product_name varchar (255), buy_url varchar(1000), feed_recommendations int , feed_buys int, feed_summary_id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,feed_summary_image varchar(255),  created_at timestamp DEFAULT CURRENT_TIMESTAMP) ;



create table if not exists reward_redemption_table (redemption_id int NOT NULL PRIMARY KEY AUTO_INCREMENT, reward_id int NOT NULL, user_id bigint NOT NULL, user_name varchar(255) NOT NULL, company_name varchar(255) NOT NULL, company_logo varchar(255), coins_value int NOT NULL , cash_value int NOT NULL , redeemed_at timestamp DEFAULT CURRENT_TIMESTAMP);



create table if not exists category_following (category_following_id bigint NOT NULL PRIMARY KEY AUTO_INCREMENT, user_name varchar(255) NOT NULL , user_id bigint NOT NULL, category_id int, category_name varchar(255) , isFollowing BOOLEAN );



create table if not exists user_following (user_following_id bigint NOT NULL PRIMARY KEY AUTO_INCREMENT, user_name varchar(255) NOT NULL , user_id bigint NOT NULL, following_user_id bigint, following_user_name varchar(255) , isFollowing BOOLEAN );



create table if not exists user_filter_summary (filter_id bigint NOT NULL PRIMARY KEY AUTO_INCREMENT , user_name varchar(255) NOT NULL , user_id bigint NOT NULL , category_clicked varchar(255) , context_clicked varchar(255) );



create table if not exists user_details_summary (user_id bigint NOT NULL PRIMARY KEY, user_name varchar(255) NOT NULL , user_profile_image varchar(255), coins_available bigint , trust_score int , updated_at timestamp DEFAULT CURRENT_TIMESTAMP );



create table if not exists user_rewards_earn (reward_id bigint NOT NULL PRIMARY KEY AUTO_INCREMENT , user_id bigint NOT NULL, user_name varchar(255) NOT NULL , reward_type varchar(255), coins_value int , reward_type_id bigint ,  created_at timestamp DEFAULT CURRENT_TIMESTAMP);



create table if not exists category_master_table ( category_id int NOT NULL PRIMARY KEY AUTO_INCREMENT, category_name varchar(255),category_image varchar(255), category_followers bigint, 
updated_at timestamp DEFAULT CURRENT_TIMESTAMP);



CREATE TABLE gold.people_to_follow (
	id BIGINT auto_increment PRIMARY KEY NOT NULL,
	user_id BIGINT NULL,
	user_name varchar(255) NULL,
	follow_user_id BIGINT NULL,
	follow_user_name varchar(255) NULL,
	follow_user_image varchar(255) NULL,
	common_points varchar(1000) NULL,
	score DOUBLE NULL,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
)


create table if not exists user_connection_batch ( user_id bigint, connection_phone_number varchar(32) ,updated_at timestamp DEFAULT CURRENT_TIMESTAMP);






update product_master_table
set product_url = replace(replace(replace(concat("https://www.amazon.in/gp/search?ie=UTF8&tag=getcandidapp-21&linkCode=ur2&creative=24630&index=aps&keywords=",product_name)," ","+"),"(","+"),")","")

