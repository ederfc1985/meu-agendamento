# Configuração do administrador

1. No Supabase, abra **Authentication → Settings → User Signups** e desative o cadastro público.
2. Execute `migrations/20261018212000_admin_patient_records.sql` no **SQL Editor** para criar a tabela de pacientes e as políticas de acesso.
3. Em **Authentication → Users**, crie o usuário administrador com e-mail e senha fortes.
4. No **SQL Editor**, atribua o papel administrativo ao e-mail criado. Substitua o endereço de exemplo pelo e-mail exato:

```sql
UPDATE auth.users
SET raw_app_meta_data =
  COALESCE(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
WHERE email = 'admin@seu-dominio.com';
```

5. Confirme que a consulta alterou uma linha. Entre na aplicação com esse e-mail e senha.

O papel usa `app_metadata`, que o usuário não pode alterar pelo cliente. Não crie uma senha padrão compartilhada, não coloque credenciais no código e não publique a `service_role` key.
