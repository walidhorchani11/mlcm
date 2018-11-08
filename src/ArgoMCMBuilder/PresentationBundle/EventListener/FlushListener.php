<?php
namespace  ArgoMCMBuilder\PresentationBundle\EventListener;
use
	Symfony\Component\HttpFoundation\Session\Session,
	Symfony\Component\Translation\TranslatorInterface,
	Doctrine\ORM\Event\OnFlushEventArgs;
class FlushListener
{
    private $session;
    protected $translator;

    public function __construct(Session $session, TranslatorInterface $translator)
    {
        $this->session = $session;
        $this->translator = $translator;
    }
    public function onKernelRequest()
    {
       // die();

    }
	public function onFlush(OnFlushEventArgs $args)
    {
        $this->session->getFlashBag()->add(
        'success',
			'aouini salem'
		);
	}
}
