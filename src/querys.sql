CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	phone_number VARCHAR(255),
	user_name VARCHAR(255),
	stage INTEGER,
	dh_last_order TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	user_address VARCHAR(255),
	ordered_products text[],
	order_value numeric
	)