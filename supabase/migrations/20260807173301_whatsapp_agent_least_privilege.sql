revoke all on table public.whatsapp_agent_checkins from authenticated;
revoke all on table public.whatsapp_agent_messages from authenticated;

grant select, insert, update, delete on table public.whatsapp_agent_checkins to authenticated;
grant select, delete on table public.whatsapp_agent_messages to authenticated;
