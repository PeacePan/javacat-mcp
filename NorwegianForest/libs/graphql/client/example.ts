import path from 'path';
import { JavaCatGraphQLClient } from '@norwegianForestLibs/graphql/client';

(async (): Promise<void> => {
	const client = new JavaCatGraphQLClient({
		env: 'dev',
		authEnvPath: path.join(__dirname, 'credentials.json'),
	});
	if (!client.isSignedIn) {
		const isOK = await client.auth.otp({
			name: '19060110',
			email: 'peace.pan@wonderpet.asia',
			dangerOTP: '123456',
		});
		console.log('OTP result:', isOK);
		const signinResult = await client.auth.signin({
			name: '19060110',
			email: 'peace.pan@wonderpet.asia',
			otp: '123456',
		});
		console.log('Signin result:', signinResult);
	} else {
		console.log('Already signed in');
	}
	await client.auth.changeUser('10210713');
	// const count = await client.query.count({
	// 	table: '__table__',
	// });
	// console.log('Count result:', count);

	// const users = await client.query.find({
	// 	table: 'transferorder',
	// 	limit: 1,
	// 	selects: ['body.name', 'lines.items._id'],
	// });
	// console.log('users result:', users);
	// const user = await client.query.get({
	// 	table: '__user__',
	// 	keyName: 'name',
	// 	keyValue: '19060110',
	// });
	// console.log('user result:', user);
	// const insertIds = await client.mutation.insert({
	// 	table: '__user__',
	// 	data: [
	// 		{
	// 			body: {
	// 				name: '19060110tester2',
	// 				displayName: '19060110tester2',
	// 				email: 'peace.pan@wonderpet.asia',
	// 				level: 'user',
	// 			},
	// 		},
	// 	],
	// });
	// console.log('user insertIds:', insertIds);
	// const updatedIds = await client.mutation.update({
	// 	table: '__user__',
	// 	data: [
	// 		{
	// 			keyName: 'name',
	// 			keyValue: '19060110tester2',
	// 			body: {
	// 				level: 'user3',
	// 			},
	// 		},
	// 	],
	// });
	// console.log('user updatedIds:', updatedIds);
	// const archivedIds = await client.mutation.archive({
	// 	table: '__user__',
	// 	data: [
	// 		{
	// 			keyName: 'name',
	// 			keyValue: '19060110tester2',
	// 		},
	// 	],
	// });
	// console.log('user archivedIds:', archivedIds);

	// await client.mutation.execute({
	// 	table: 'possale',
	// 	name: 'finishCheckout',
	// 	key: { name: 'name', value: 'POS-202409-00001' },
	// 	argument: {
	// 		body: {
	// 			eGUICarrier: '1234567890',
	// 		},
	// 	},
	// });
	// await client.mutation.call({
	// 	table: 'dsvorder',
	// 	name: '出貨拋單',
	// 	argument: {
	// 		keys: [{ name: 'name', value: 'ˇ300215' }],
	// 		argument: {
	// 			assignedShippedAt: new Date(),
	// 		},
	// 	},
	// });
})();
