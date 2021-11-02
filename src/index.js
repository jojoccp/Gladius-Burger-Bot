const wa = require('@open-wa/wa-automate');

wa.create().then(client => start(client));

async function start(client) {

    await client.onMessage(async message => {
        setUser(message.from, message.sender.pushname, 0)
   
        setTimeout( async function () { 
            var gettingStage = await getStage(message.from)

             if(gettingStage == 0){
                var element =  executeStage0(message.from, message.body)
                client.sendText(message.from, element)                
                setTimeout(() => {
                    client.sendText(message.from, executeStage1(message.from, message.body))
                }, 5000)
                updateStage(1, message.from)       
            } if(gettingStage == 1){
                element = executeStage1Choice(message.from, message.body)
                
                    client.sendText(message.from, element)

                    if(message.body == 2){
                        updateStage(0, message.from)
                    } else {
                        setTimeout(()=> {
                            client.sendText(message.from, executeStage2(message.from, message.body))
                        }, 2000)
                        updateStage(2, message.from)
                    }
                    
            } if(gettingStage == 2){
                element = await executeStage2Choice(message.from, message.body)
                client.sendText(message.from, element)
            } if(gettingStage == 3){
                element = executeStage3(message.from, message.body)
                client.sendText(message.from, element)
            } if(gettingStage == 4){
                element = executeStage4(message.from, message.body)
                client.sendText(message.from, element)
            } if(gettingStage == 5){
                element = executeStage5(message.from, message.body)
                client.sendText(message.from, element)
            } 
          }, 100)          
    });
  }

/////////////////////////DATABASE\\\\\\\\\\\\\\\\\\\\\\\\\DATABASE/////////////////////////DATABASE\\\\\\\\\\\\\\\\\\\\\\\\\
  const db = require('./database')
   db.connect()

    async function insertData(phoneNumber, userName, stage) {
        const query = 'INSERT INTO users (phone_number, user_name, stage, order_value) VALUES ($1, $2, $3, $4)'
        const values = [phoneNumber, userName, stage, 0]

        await db.query(query, values)

    }

    async function getData(phoneNumber) {
        const query = 'SELECT * FROM users WHERE phone_number = $1'
        const values = [phoneNumber]

        var res =  await db.query(query, values)
        if(res.rowCount == 0){
            return undefined
        }
        
        return res    
    }

    async function updateData(stage, phoneNumber) {
        const query = `UPDATE users SET stage = $1 WHERE phone_number ='${phoneNumber}'`
        const values = [stage]

        var response = await db.query(query, values)
        return response  
    }

    async function updateOrder(order, orderValue, phoneNumber) {
        console.log('updateOrder') 
        const query = `UPDATE users SET ordered_products = array_append(ordered_products, '${order}'), order_value = order_value + ${orderValue} WHERE phone_number ='${phoneNumber}'`
        const values = [order, orderValue, phoneNumber]

        var response = await db.query(query)
        return response
        
    }

    async function restartOrder(phoneNumber){
        const query = `UPDATE users SET order_value = 0, ordered_products = '{}'  WHERE phone_number = '${phoneNumber}'`

        var response = await db.query(query)
        return response
    }
/////////////////////////DATABASE\\\\\\\\\\\\\\\\\\\\\\\\\DATABASE/////////////////////////DATABASE\\\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////////USUÁRIO\\\\\\\\\\\\\\\\\\\\\\\\\USUÁRIO/////////////////////////USUÁRIO\\\\\\\\\\\\\\\\\\\\\\\\\

    async function setUser(phoneNumber, userName, stage){
        var response =  await getData(phoneNumber) 

            if(response != undefined) {
            } else {
                insertData(phoneNumber, userName, stage)
            }
    }

    async function updateStage(stage, phoneNumber) {
        await updateData(stage, phoneNumber)
        }

    async function getStage(phoneNumber){
        var response = await getData(phoneNumber)
        return response.rows[0].stage
    }

    async function getOrder(phoneNumber) {
        var response = await getData(phoneNumber)
        return response.rows[0].ordered_products
    }

    async function getOrderValue(phoneNumber) {
        var response = await getData(phoneNumber)
        return response.rows[0].order_value
    }

/////////////////////////USUÁRIO\\\\\\\\\\\\\\\\\\\\\\\\\USUÁRIO/////////////////////////USUÁRIO\\\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////////STAGES\\\\\\\\\\\\\\\\\\\\\\\\\STAGES/////////////////////////STAGES\\\\\\\\\\\\\\\\\\\\\\\\\

    function executeStage0(phoneNumber, msg){
        console.log('Executando Estágio 0')

        let response = 'Olá, sou a assistente virtual da Gladius Burger. 🙍‍♀️ 💻 \n'
        response += 'Estou aqui para te dar suporte na escolha do seu pedido 👍 \n'
        response += 'Para ver os pedidos com fotos, é só acessar nosso catálogo no link abaixo \n'
        response += 'https://wa.me/c/5511958483446 \n' 

        return response
    }
  
    function executeStage1(phoneNumber, msg) {
        console.log('Executando Estágio 1')
        let response = "Deseja realizar o pedido?\n"
        response += "Digite:\n1- Sim ✅ \n2- Não ⛔"
        return response
    }

    function executeStage1Choice(user, msg) {
        console.log('Executando Estágio 1 Choice')
        
        if(msg == 1 ){
            let response = "Ok, vamos ao seu pedido 😋\n"           
            return response
        } else if(msg == 2){
            response = "Que pena!. 🥲\nMas aguardo seu contato em breve\nA Gladius Burger agradece."
            updateStage(0, user)
            return response
        }
    }

    const cardapio = [ 
        { descricao:"Burguer do Mês", preco: 25.99},
        { descricao:"Combo Gladius", preco: 49.99 },
        { descricao:"Combo Galera", preco: 52.90 },
        { descricao:"Porção de Cebola Orion", preco: 19.99},
        { descricao:"Atenas", preco: 22.90},
        { descricao:"Combo Familia", preco: 54.90 },
        { descricao:"Maximus", preco: 25.99 },
        { descricao:"Tróia", preco: 15.99 },
        { descricao:"Spartacus", preco: 29.99 },
        { descricao:"Imperador", preco: 25.99 },
        { descricao:"Coliseu", preco: 19.99 },
        { descricao:"Combo Tróia", preco: 22.50 },
        { descricao:"Combo Maximus", preco: 32.50 },
        { descricao:"Combo Spartacus", preco: 36.50 },
        { descricao:"Combo Imperador", preco: 32.50 },
        { descricao:"Combo Coliseu", preco: 26.50 },
        { descricao:"Batata Gladius", preco: 19.90 },
        { descricao:"Refrigerante e Suco Lata", preco: 5.00 },
        { descricao:"Torta Holandesa", preco: 5.50 }           
    ]

    function executeStage2(phoneNumber, msg) {
        console.log('Executando Estágio 2')
        let response = "Selecione pelo número: \n\n"

        for (let index = 0; index < cardapio.length; index++) {
            const element = cardapio[index];
            response += `${index+1} -> ${cardapio[index].descricao}  R$ ${cardapio[index].preco} \n`     
        }
        response += '\n\nDigite * para finalizar o pedido.'
       
         return response
    }
             
   async function executeStage2Choice(phoneNumber, msg) {   
    console.log('Executando Estágio 2 Choice') 
        if(cardapio[msg-1]){            
            updateOrder(cardapio[msg-1].descricao, cardapio[msg-1].preco, phoneNumber) 
            updateStage(2, phoneNumber)
            return  `${cardapio[msg-1].descricao} foi adicionado ao pedido`
        } if(msg == '*'){
            updateStage(3, phoneNumber)
            var response = `Pedido finalizado. 📝\n\nItens adicionados ao pedido:\n`
            var order = await getOrder(phoneNumber)
            var orderValue = await getOrderValue(phoneNumber)

             response += order
             response += `\nTotal: ${orderValue} 💸`
             response += '\n\n\nConfirma o pedido?\n1- Sim ✅ \n2- Não ⛔'
        
            return response
        } 
        if(!cardapio[msg-1]){
            return 'Hum...🤔 \nO código que você digitou está errado.\nPor favor, digite novamente:'
        } 
    }

    function executeStage3(phoneNumber, msg){
        console.log('Executando Estágio 3')
        let response =''
        if(msg == 1){
            response = '📌 Digite seu endereço e o número da residência: '
            updateStage(4, phoneNumber)
        } if(msg == 2) {
            updateStage(2, phoneNumber)
            response = 'Ok, vamos refazer seu pedido 😅\n\n'

            response += "Selecione pelo número: \n\n"

            for (let index = 0; index < cardapio.length; index++) {
                const element = cardapio[index];
                response += `${index+1} -> ${cardapio[index].descricao}  R$ ${cardapio[index].preco} \n`     
            }
            response += '\n\nDigite * para finalizar o pedido.'
        }
        
        return response
    }

    function executeStage4(phoneNumber,msg){
        console.log('Executando Estágio 4')
        var response = 'O endereço:\n' + msg + '\n\nEstá correto?\n1- Sim ✅ \n2- Não ⛔ ... desejo corrigir'
        updateStage(5, phoneNumber)
        
        return response      
    }

    function executeStage5(phoneNumber,msg){
        console.log('Executando Estágio 5')
        var response = ''
        if(msg == 1){
            restartOrder(phoneNumber)
            updateStage(0, phoneNumber)
            response = 'Agora é só aguardar 👏\n'
            response += 'Em alguns instantes seu pedido chegará em sua residência.\n'
            response += 'A Gladius Burger agradece a preferência 🍔 🍟 🧋\n'
            response += 'Obrigado'
        return response
        } if(msg == 2){
            response += 'Ok 😅\n Digite novamente seu endereço: '
            updateStage(4, phoneNumber)

            return response
        }
    }
/////////////////////////STAGES\\\\\\\\\\\\\\\\\\\\\\\\\STAGES/////////////////////////STAGES\\\\\\\\\\\\\\\\\\\\\\\\\    