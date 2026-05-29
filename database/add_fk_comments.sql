-- Add foreign keys for report_comments table
ALTER TABLE public.report_comments 
ADD CONSTRAINT report_comments_report_fk FOREIGN KEY (report_id) REFERENCES public.reports(id);

ALTER TABLE public.report_comments 
ADD CONSTRAINT report_comments_user_fk FOREIGN KEY (user_id) REFERENCES public.users(id);