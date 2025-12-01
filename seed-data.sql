-- ============================================
-- SCRIPT DE SEED PARA FINANCEX
-- ============================================
-- IMPORTANTE: Substitua 'YOUR_USER_ID_HERE' pelo seu user_id real
-- Para obter seu user_id, execute no SQL Editor do Supabase:
-- SELECT id FROM auth.users WHERE email = 'seu-email@example.com';
-- ============================================

-- Defina seu user_id aqui
DO $$
DECLARE
    v_user_id uuid := 'YOUR_USER_ID_HERE'; -- SUBSTITUA AQUI!
    
    -- IDs de categorias
    v_cat_salario uuid;
    v_cat_freelance uuid;
    v_cat_investimentos uuid;
    v_cat_alimentacao uuid;
    v_cat_transporte uuid;
    v_cat_moradia uuid;
    v_cat_lazer uuid;
    v_cat_saude uuid;
    v_cat_educacao uuid;
    v_cat_compras uuid;
    
    -- IDs de contas
    v_conta_corrente uuid;
    v_conta_poupanca uuid;
    v_conta_investimento uuid;
    
BEGIN
    -- ============================================
    -- 1. CATEGORIAS
    -- ============================================
    
    -- Categorias de Receita
    INSERT INTO categories (user_id, name, type, icon)
    VALUES 
        (v_user_id, 'Salário', 'income', '💰'),
        (v_user_id, 'Freelance', 'income', '💼'),
        (v_user_id, 'Investimentos', 'income', '📈')
    RETURNING id INTO v_cat_salario;
    
    SELECT id INTO v_cat_freelance FROM categories WHERE user_id = v_user_id AND name = 'Freelance';
    SELECT id INTO v_cat_investimentos FROM categories WHERE user_id = v_user_id AND name = 'Investimentos';
    
    -- Categorias de Despesa
    INSERT INTO categories (user_id, name, type, icon)
    VALUES 
        (v_user_id, 'Alimentação', 'expense', '🍔'),
        (v_user_id, 'Transporte', 'expense', '🚗'),
        (v_user_id, 'Moradia', 'expense', '🏠'),
        (v_user_id, 'Lazer', 'expense', '🎮'),
        (v_user_id, 'Saúde', 'expense', '💊'),
        (v_user_id, 'Educação', 'expense', '📚'),
        (v_user_id, 'Compras', 'expense', '🛒')
    RETURNING id INTO v_cat_alimentacao;
    
    SELECT id INTO v_cat_transporte FROM categories WHERE user_id = v_user_id AND name = 'Transporte';
    SELECT id INTO v_cat_moradia FROM categories WHERE user_id = v_user_id AND name = 'Moradia';
    SELECT id INTO v_cat_lazer FROM categories WHERE user_id = v_user_id AND name = 'Lazer';
    SELECT id INTO v_cat_saude FROM categories WHERE user_id = v_user_id AND name = 'Saúde';
    SELECT id INTO v_cat_educacao FROM categories WHERE user_id = v_user_id AND name = 'Educação';
    SELECT id INTO v_cat_compras FROM categories WHERE user_id = v_user_id AND name = 'Compras';
    
    -- ============================================
    -- 2. CONTAS
    -- ============================================
    
    INSERT INTO accounts (user_id, name, type, balance)
    VALUES 
        (v_user_id, 'Conta Corrente', 'checking', 5420.50),
        (v_user_id, 'Poupança', 'savings', 15000.00),
        (v_user_id, 'Investimentos', 'investment', 32500.00)
    RETURNING id INTO v_conta_corrente;
    
    SELECT id INTO v_conta_poupanca FROM accounts WHERE user_id = v_user_id AND name = 'Poupança';
    SELECT id INTO v_conta_investimento FROM accounts WHERE user_id = v_user_id AND name = 'Investimentos';
    
    -- ============================================
    -- 3. TRANSAÇÕES (Últimos 6 meses)
    -- ============================================
    
    -- Mês 1 (6 meses atrás)
    INSERT INTO transactions (user_id, type, amount, description, date, category_id, account_id)
    VALUES 
        -- Receitas
        (v_user_id, 'income', 6500.00, 'Salário Mensal', CURRENT_DATE - INTERVAL '6 months', v_cat_salario, v_conta_corrente),
        (v_user_id, 'income', 1200.00, 'Projeto Freelance', CURRENT_DATE - INTERVAL '6 months' + INTERVAL '5 days', v_cat_freelance, v_conta_corrente),
        -- Despesas
        (v_user_id, 'expense', 1500.00, 'Aluguel', CURRENT_DATE - INTERVAL '6 months' + INTERVAL '1 day', v_cat_moradia, v_conta_corrente),
        (v_user_id, 'expense', 450.00, 'Supermercado', CURRENT_DATE - INTERVAL '6 months' + INTERVAL '2 days', v_cat_alimentacao, v_conta_corrente),
        (v_user_id, 'expense', 280.00, 'Gasolina', CURRENT_DATE - INTERVAL '6 months' + INTERVAL '3 days', v_cat_transporte, v_conta_corrente),
        (v_user_id, 'expense', 150.00, 'Cinema e Jantar', CURRENT_DATE - INTERVAL '6 months' + INTERVAL '7 days', v_cat_lazer, v_conta_corrente),
        (v_user_id, 'expense', 320.00, 'Farmácia', CURRENT_DATE - INTERVAL '6 months' + INTERVAL '10 days', v_cat_saude, v_conta_corrente),
        (v_user_id, 'expense', 250.00, 'Restaurante', CURRENT_DATE - INTERVAL '6 months' + INTERVAL '15 days', v_cat_alimentacao, v_conta_corrente);
    
    -- Mês 2 (5 meses atrás)
    INSERT INTO transactions (user_id, type, amount, description, date, category_id, account_id)
    VALUES 
        (v_user_id, 'income', 6500.00, 'Salário Mensal', CURRENT_DATE - INTERVAL '5 months', v_cat_salario, v_conta_corrente),
        (v_user_id, 'income', 800.00, 'Projeto Freelance', CURRENT_DATE - INTERVAL '5 months' + INTERVAL '8 days', v_cat_freelance, v_conta_corrente),
        (v_user_id, 'expense', 1500.00, 'Aluguel', CURRENT_DATE - INTERVAL '5 months' + INTERVAL '1 day', v_cat_moradia, v_conta_corrente),
        (v_user_id, 'expense', 520.00, 'Supermercado', CURRENT_DATE - INTERVAL '5 months' + INTERVAL '3 days', v_cat_alimentacao, v_conta_corrente),
        (v_user_id, 'expense', 300.00, 'Gasolina', CURRENT_DATE - INTERVAL '5 months' + INTERVAL '5 days', v_cat_transporte, v_conta_corrente),
        (v_user_id, 'expense', 200.00, 'Streaming e Apps', CURRENT_DATE - INTERVAL '5 months' + INTERVAL '10 days', v_cat_lazer, v_conta_corrente),
        (v_user_id, 'expense', 450.00, 'Curso Online', CURRENT_DATE - INTERVAL '5 months' + INTERVAL '12 days', v_cat_educacao, v_conta_corrente);
    
    -- Mês 3 (4 meses atrás)
    INSERT INTO transactions (user_id, type, amount, description, date, category_id, account_id)
    VALUES 
        (v_user_id, 'income', 6500.00, 'Salário Mensal', CURRENT_DATE - INTERVAL '4 months', v_cat_salario, v_conta_corrente),
        (v_user_id, 'income', 1500.00, 'Projeto Freelance', CURRENT_DATE - INTERVAL '4 months' + INTERVAL '10 days', v_cat_freelance, v_conta_corrente),
        (v_user_id, 'income', 250.00, 'Dividendos', CURRENT_DATE - INTERVAL '4 months' + INTERVAL '15 days', v_cat_investimentos, v_conta_investimento),
        (v_user_id, 'expense', 1500.00, 'Aluguel', CURRENT_DATE - INTERVAL '4 months' + INTERVAL '1 day', v_cat_moradia, v_conta_corrente),
        (v_user_id, 'expense', 480.00, 'Supermercado', CURRENT_DATE - INTERVAL '4 months' + INTERVAL '4 days', v_cat_alimentacao, v_conta_corrente),
        (v_user_id, 'expense', 320.00, 'Gasolina', CURRENT_DATE - INTERVAL '4 months' + INTERVAL '6 days', v_cat_transporte, v_conta_corrente),
        (v_user_id, 'expense', 600.00, 'Roupas', CURRENT_DATE - INTERVAL '4 months' + INTERVAL '14 days', v_cat_compras, v_conta_corrente),
        (v_user_id, 'expense', 180.00, 'Lazer', CURRENT_DATE - INTERVAL '4 months' + INTERVAL '20 days', v_cat_lazer, v_conta_corrente);
    
    -- Mês 4 (3 meses atrás)
    INSERT INTO transactions (user_id, type, amount, description, date, category_id, account_id)
    VALUES 
        (v_user_id, 'income', 6500.00, 'Salário Mensal', CURRENT_DATE - INTERVAL '3 months', v_cat_salario, v_conta_corrente),
        (v_user_id, 'income', 2000.00, 'Projeto Freelance', CURRENT_DATE - INTERVAL '3 months' + INTERVAL '12 days', v_cat_freelance, v_conta_corrente),
        (v_user_id, 'expense', 1500.00, 'Aluguel', CURRENT_DATE - INTERVAL '3 months' + INTERVAL '1 day', v_cat_moradia, v_conta_corrente),
        (v_user_id, 'expense', 550.00, 'Supermercado', CURRENT_DATE - INTERVAL '3 months' + INTERVAL '5 days', v_cat_alimentacao, v_conta_corrente),
        (v_user_id, 'expense', 290.00, 'Gasolina', CURRENT_DATE - INTERVAL '3 months' + INTERVAL '7 days', v_cat_transporte, v_conta_corrente),
        (v_user_id, 'expense', 800.00, 'Dentista', CURRENT_DATE - INTERVAL '3 months' + INTERVAL '10 days', v_cat_saude, v_conta_corrente),
        (v_user_id, 'expense', 350.00, 'Restaurantes', CURRENT_DATE - INTERVAL '3 months' + INTERVAL '18 days', v_cat_alimentacao, v_conta_corrente);
    
    -- Mês 5 (2 meses atrás)
    INSERT INTO transactions (user_id, type, amount, description, date, category_id, account_id)
    VALUES 
        (v_user_id, 'income', 6500.00, 'Salário Mensal', CURRENT_DATE - INTERVAL '2 months', v_cat_salario, v_conta_corrente),
        (v_user_id, 'income', 1800.00, 'Projeto Freelance', CURRENT_DATE - INTERVAL '2 months' + INTERVAL '8 days', v_cat_freelance, v_conta_corrente),
        (v_user_id, 'income', 300.00, 'Dividendos', CURRENT_DATE - INTERVAL '2 months' + INTERVAL '15 days', v_cat_investimentos, v_conta_investimento),
        (v_user_id, 'expense', 1500.00, 'Aluguel', CURRENT_DATE - INTERVAL '2 months' + INTERVAL '1 day', v_cat_moradia, v_conta_corrente),
        (v_user_id, 'expense', 500.00, 'Supermercado', CURRENT_DATE - INTERVAL '2 months' + INTERVAL '3 days', v_cat_alimentacao, v_conta_corrente),
        (v_user_id, 'expense', 310.00, 'Gasolina', CURRENT_DATE - INTERVAL '2 months' + INTERVAL '6 days', v_cat_transporte, v_conta_corrente),
        (v_user_id, 'expense', 250.00, 'Lazer', CURRENT_DATE - INTERVAL '2 months' + INTERVAL '12 days', v_cat_lazer, v_conta_corrente),
        (v_user_id, 'expense', 400.00, 'Eletrônicos', CURRENT_DATE - INTERVAL '2 months' + INTERVAL '16 days', v_cat_compras, v_conta_corrente);
    
    -- Mês 6 (1 mês atrás)
    INSERT INTO transactions (user_id, type, amount, description, date, category_id, account_id)
    VALUES 
        (v_user_id, 'income', 6500.00, 'Salário Mensal', CURRENT_DATE - INTERVAL '1 month', v_cat_salario, v_conta_corrente),
        (v_user_id, 'income', 2200.00, 'Projeto Freelance', CURRENT_DATE - INTERVAL '1 month' + INTERVAL '10 days', v_cat_freelance, v_conta_corrente),
        (v_user_id, 'expense', 1500.00, 'Aluguel', CURRENT_DATE - INTERVAL '1 month' + INTERVAL '1 day', v_cat_moradia, v_conta_corrente),
        (v_user_id, 'expense', 530.00, 'Supermercado', CURRENT_DATE - INTERVAL '1 month' + INTERVAL '4 days', v_cat_alimentacao, v_conta_corrente),
        (v_user_id, 'expense', 300.00, 'Gasolina', CURRENT_DATE - INTERVAL '1 month' + INTERVAL '8 days', v_cat_transporte, v_conta_corrente),
        (v_user_id, 'expense', 180.00, 'Academia', CURRENT_DATE - INTERVAL '1 month' + INTERVAL '5 days', v_cat_saude, v_conta_corrente),
        (v_user_id, 'expense', 320.00, 'Restaurantes', CURRENT_DATE - INTERVAL '1 month' + INTERVAL '14 days', v_cat_alimentacao, v_conta_corrente),
        (v_user_id, 'expense', 200.00, 'Cinema e Shows', CURRENT_DATE - INTERVAL '1 month' + INTERVAL '20 days', v_cat_lazer, v_conta_corrente);
    
    -- Mês Atual
    INSERT INTO transactions (user_id, type, amount, description, date, category_id, account_id)
    VALUES 
        (v_user_id, 'income', 6500.00, 'Salário Mensal', CURRENT_DATE - INTERVAL '5 days', v_cat_salario, v_conta_corrente),
        (v_user_id, 'expense', 1500.00, 'Aluguel', CURRENT_DATE - INTERVAL '4 days', v_cat_moradia, v_conta_corrente),
        (v_user_id, 'expense', 280.00, 'Supermercado', CURRENT_DATE - INTERVAL '2 days', v_cat_alimentacao, v_conta_corrente),
        (v_user_id, 'expense', 150.00, 'Gasolina', CURRENT_DATE - INTERVAL '1 day', v_cat_transporte, v_conta_corrente);
    
    -- ============================================
    -- 4. ORÇAMENTOS
    -- ============================================
    
    INSERT INTO budgets (user_id, category_id, limit_amount, spent_amount, month, year)
    VALUES 
        (v_user_id, v_cat_alimentacao, 1000.00, 280.00, EXTRACT(MONTH FROM CURRENT_DATE)::INTEGER, EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER),
        (v_user_id, v_cat_transporte, 500.00, 150.00, EXTRACT(MONTH FROM CURRENT_DATE)::INTEGER, EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER),
        (v_user_id, v_cat_moradia, 1500.00, 1500.00, EXTRACT(MONTH FROM CURRENT_DATE)::INTEGER, EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER),
        (v_user_id, v_cat_lazer, 400.00, 0.00, EXTRACT(MONTH FROM CURRENT_DATE)::INTEGER, EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER),
        (v_user_id, v_cat_saude, 300.00, 0.00, EXTRACT(MONTH FROM CURRENT_DATE)::INTEGER, EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER);
    
    -- ============================================
    -- 5. METAS
    -- ============================================
    
    INSERT INTO goals (user_id, name, description, type, target_amount, current_amount, deadline)
    VALUES 
        (v_user_id, 'Fundo de Emergência', 'Reserva de 6 meses de despesas', 'savings', 30000.00, 15000.00, CURRENT_DATE + INTERVAL '8 months'),
        (v_user_id, 'Viagem para Europa', 'Férias de verão 2025', 'savings', 15000.00, 4500.00, CURRENT_DATE + INTERVAL '6 months'),
        (v_user_id, 'Carro Novo', 'Entrada para carro 0km', 'savings', 25000.00, 8000.00, CURRENT_DATE + INTERVAL '12 months'),
        (v_user_id, 'Carteira de Investimentos', 'Diversificar investimentos', 'investment', 50000.00, 32500.00, CURRENT_DATE + INTERVAL '18 months'),
        (v_user_id, 'Quitação Cartão', 'Pagar dívida do cartão', 'debt', 5000.00, 3200.00, CURRENT_DATE + INTERVAL '4 months');
    
    -- ============================================
    -- 6. INVESTIMENTOS
    -- ============================================
    
    INSERT INTO investments (user_id, name, type, amount_invested, current_value, purchase_date, notes)
    VALUES 
        (v_user_id, 'Tesouro Selic 2027', 'bonds', 10000.00, 10850.00, CURRENT_DATE - INTERVAL '8 months', 'Investimento conservador para reserva'),
        (v_user_id, 'Ações PETR4', 'stocks', 5000.00, 6200.00, CURRENT_DATE - INTERVAL '10 months', 'Ações da Petrobras'),
        (v_user_id, 'Ações VALE3', 'stocks', 4000.00, 4800.00, CURRENT_DATE - INTERVAL '7 months', 'Ações da Vale'),
        (v_user_id, 'Bitcoin', 'crypto', 3000.00, 3850.00, CURRENT_DATE - INTERVAL '5 months', 'Investimento em criptomoeda'),
        (v_user_id, 'Ethereum', 'crypto', 2000.00, 2400.00, CURRENT_DATE - INTERVAL '4 months', 'Diversificação em crypto'),
        (v_user_id, 'FII HGLG11', 'real_estate', 8000.00, 8600.00, CURRENT_DATE - INTERVAL '12 months', 'Fundo imobiliário'),
        (v_user_id, 'CDB Banco XYZ', 'bonds', 5000.00, 5350.00, CURRENT_DATE - INTERVAL '6 months', 'CDB com liquidez diária');
    
    RAISE NOTICE 'Seed data inserido com sucesso!';
    RAISE NOTICE 'Total de categorias: 10';
    RAISE NOTICE 'Total de contas: 3';
    RAISE NOTICE 'Total de transações: ~60';
    RAISE NOTICE 'Total de orçamentos: 5';
    RAISE NOTICE 'Total de metas: 5';
    RAISE NOTICE 'Total de investimentos: 7';
    
END $$;
