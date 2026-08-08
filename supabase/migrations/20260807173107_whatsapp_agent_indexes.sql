create index if not exists whatsapp_agent_checkins_user_id_idx
  on public.whatsapp_agent_checkins (user_id);

create index if not exists whatsapp_agent_messages_checkin_id_idx
  on public.whatsapp_agent_messages (checkin_id)
  where checkin_id is not null;
